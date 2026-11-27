import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/app/api/middleware'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest, { params }: { params: Promise<{ eventId: string }> }) {
    const { error, user } = requireAuth(req)
    if (error) return error

    try {
        const { eventId } = await params
        const event = await prisma.admitCardEvent.findUnique({
            where: { id: eventId, tenantId: user!.tenantId },
            include: {
                course: { select: { name: true } },
                batch: { select: { name: true } },
                admitCards: {
                    include: {
                        student: {
                            select: {
                                fullName: true,
                                fatherName: true,
                                motherName: true,
                                dob: true,
                                photo: true,
                                scholarNo: true,
                                tcGenerated: true,
                                status: true,
                                userAccount: { select: { isActive: true } },
                            }
                        }
                    },
                    orderBy: { createdAt: 'asc' }
                }
            }
        })

        if (!event) return NextResponse.json({ error: 'Not found' }, { status: 404 })

        return NextResponse.json({ success: true, data: event })
    } catch (err) {
        console.error('Fetch admit card event error:', err)
        return NextResponse.json({ error: 'Failed to fetch event' }, { status: 500 })
    }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ eventId: string }> }) {
    const { error, user } = requireAuth(req)
    if (error) return error

    try {
        const { eventId } = await params
        const body = await req.json()
        const { action, studentIds } = body

        if (!action || !studentIds || !Array.isArray(studentIds)) {
            return NextResponse.json({ error: 'Invalid request payload' }, { status: 400 })
        }

        const event = await prisma.admitCardEvent.findUnique({
            where: { id: eventId, tenantId: user!.tenantId }
        })
        if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 })

        if (action === 'block') {
            await prisma.admitCard.updateMany({
                where: { eventId, studentId: { in: studentIds }, tenantId: user!.tenantId },
                data: { isBlocked: true, isPublished: false, superAdminApproved: false }
            })
        } else if (action === 'unblock') {
            await prisma.admitCard.updateMany({
                where: { eventId, studentId: { in: studentIds }, tenantId: user!.tenantId },
                data: { isBlocked: false }
            })
        } else if (action === 'unpublish') {
            await prisma.admitCard.updateMany({
                where: { eventId, studentId: { in: studentIds }, tenantId: user!.tenantId },
                data: { isPublished: false }
            })
        } else if (action === 'publish') {
            const cards = await prisma.admitCard.findMany({
                where: { eventId, studentId: { in: studentIds }, tenantId: user!.tenantId },
                include: {
                    student: {
                        select: {
                            status: true,
                            tcGenerated: true,
                            userAccount: { select: { isActive: true } }
                        }
                    }
                }
            })

            const toPublish = cards
                .filter(c =>
                    c.student.status === 'ACTIVE' &&
                    !c.student.tcGenerated &&
                    c.student.userAccount?.isActive !== false &&
                    (!c.isBlocked || c.superAdminApproved)
                )
                .map(c => c.id)

            if (toPublish.length > 0) {
                await prisma.admitCard.updateMany({
                    where: { id: { in: toPublish } },
                    data: { isPublished: true }
                })
            }
            if (toPublish.length < studentIds.length) {
                return NextResponse.json({
                    success: true,
                    message: `Published ${toPublish.length} cards. Blocked or TC-generated students were skipped.`
                })
            }
        } else if (action === 'approve') {
            if (user!.role !== 'SUPER_ADMIN' && user!.role !== 'COACHING_ADMIN') {
                return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
            }
            await prisma.admitCard.updateMany({
                where: { eventId, studentId: { in: studentIds }, tenantId: user!.tenantId },
                data: { superAdminApproved: true }
            })
        }

        return NextResponse.json({ success: true, message: 'Updated successfully' })
    } catch (err) {
        console.error('Update admit cards error:', err)
        return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ eventId: string }> }) {
    const { error, user } = requireAuth(req)
    if (error) return error

    try {
        const { eventId } = await params
        await prisma.admitCardEvent.delete({
            where: { id: eventId, tenantId: user!.tenantId }
        })
        return NextResponse.json({ success: true, message: 'Deleted successfully' })
    } catch (err) {
        console.error('Delete event error:', err)
        return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
    }
}
