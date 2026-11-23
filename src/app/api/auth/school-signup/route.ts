import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, signAccessToken, signRefreshToken } from '@/lib/auth'

function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .slice(0, 50)
}

async function generateUniqueSchoolCode(): Promise<string> {
    const year = new Date().getFullYear()
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    let code = ''
    let exists = false
    do {
        const rand = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
        code = 'SCL-' + year + '-' + rand
        exists = !!(await prisma.tenant.findUnique({ where: { schoolCode: code } }))
    } while (exists)
    return code
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { schoolName, schoolAddress, schoolPhone, schoolEmail, directorName, directorPhone, directorEmail, email, password, schoolKey } = body

        if (!schoolName || !directorName || !email || !password) {
            return NextResponse.json({ error: 'School name, director name, email and password are required' }, { status: 400 })
        }

        if (password.length < 6) {
            return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
        }

        const normName = schoolName.trim().toLowerCase()
        const targetSlug = schoolKey === 'mjf' || normName.includes('mjf')
            ? 'mjf'
            : (schoolKey === 'shivaji' || normName.includes('shivaji') || normName.includes('chhatrapati'))
            ? 'shivaji'
            : generateSlug(schoolName)

        // 1. Check if matching tenant already exists (e.g. tenant_mjf or tenant_shivaji)
        let existingTenant = await prisma.tenant.findFirst({
            where: {
                OR: [
                    { slug: targetSlug },
                    { id: targetSlug === 'mjf' ? 'tenant_mjf' : targetSlug === 'shivaji' ? 'tenant_shivaji' : undefined },
                    { name: { contains: schoolName.trim(), mode: 'insensitive' } }
                ].filter(Boolean) as any
            }
        })

        // 2. If tenant does not exist yet, check total tenant count (Strict limit of 2)
        if (!existingTenant) {
            const totalSchools = await prisma.tenant.count()
            if (totalSchools >= 2) {
                return NextResponse.json({
                    error: 'Registration limit reached. Only 2 schools (MJF Convent School & Chhatrapati Shivaji Higher Secondary School) are permitted on this platform. Please select one of these two schools to set up your credentials.',
                    limitReached: true,
                }, { status: 403 })
            }
        }

        const hashedPassword = await hashPassword(password)
        const targetEmail = email.toLowerCase().trim()

        const result = await prisma.$transaction(async (tx) => {
            let tenant = existingTenant

            if (tenant) {
                // Update existing tenant with user-supplied details
                tenant = await tx.tenant.update({
                    where: { id: tenant.id },
                    data: {
                        name: schoolName,
                        address: schoolAddress || tenant.address,
                        phone: schoolPhone || tenant.phone,
                        email: schoolEmail || tenant.email,
                        directorName: directorName || tenant.directorName,
                        directorPhone: directorPhone || tenant.directorPhone,
                        directorEmail: directorEmail || targetEmail,
                    }
                })
            } else {
                // Create new tenant (only if < 2 schools exist)
                const schoolCode = await generateUniqueSchoolCode()
                tenant = await tx.tenant.create({
                    data: {
                        name: schoolName,
                        slug: targetSlug,
                        schoolCode,
                        address: schoolAddress || null,
                        phone: schoolPhone || null,
                        email: schoolEmail || null,
                        isActive: true,
                        directorName,
                        directorPhone: directorPhone || null,
                        directorEmail: directorEmail || targetEmail,
                    }
                })

                const trialEnd = new Date()
                trialEnd.setDate(trialEnd.getDate() + 30)
                await tx.subscription.create({
                    data: {
                        tenantId: tenant.id,
                        plan: 'BASIC',
                        status: 'TRIAL',
                        trialEndsAt: trialEnd,
                    }
                })
            }

            // Find or create the Super Admin for this tenant
            let user = await tx.user.findFirst({
                where: {
                    tenantId: tenant.id,
                    role: 'SUPER_ADMIN'
                }
            })

            if (user) {
                // Update existing Super Admin with new user credentials
                user = await tx.user.update({
                    where: { id: user.id },
                    data: {
                        email: targetEmail,
                        password: hashedPassword,
                        plainPassword: password,
                        name: directorName,
                        phone: directorPhone || user.phone,
                        isActive: true,
                    }
                })
            } else {
                // Create Super Admin user
                user = await tx.user.create({
                    data: {
                        tenantId: tenant.id,
                        email: targetEmail,
                        phone: directorPhone || null,
                        password: hashedPassword,
                        plainPassword: password,
                        name: directorName,
                        role: 'SUPER_ADMIN',
                        isActive: true,
                    }
                })
            }

            return { tenant, user }
        })

        const payload = {
            userId: result.user.id,
            tenantId: result.tenant.id,
            role: 'SUPER_ADMIN',
            email: result.user.email,
        }

        const accessToken = signAccessToken(payload)
        const refreshToken = signRefreshToken(payload)

        return NextResponse.json({
            success: true,
            message: 'Super Admin credentials setup successfully! Welcome to ' + result.tenant.name,
            accessToken,
            refreshToken,
            user: {
                id: result.user.id,
                name: result.user.name,
                email: result.user.email,
                role: 'SUPER_ADMIN',
                tenantId: result.tenant.id,
            },
            tenant: {
                id: result.tenant.id,
                name: result.tenant.name,
                slug: result.tenant.slug,
                schoolCode: result.tenant.schoolCode,
                registrationCode: result.tenant.registrationCode,
                diseCode: result.tenant.diseCode,
                themeColor: result.tenant.themeColor,
            }
        }, { status: 201 })
    } catch (error: any) {
        console.error('School signup error:', error)
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
    }
}