import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/app/api/middleware'
import { prisma } from '@/lib/prisma'
import { createAdmitCardEventWithRollNumbers } from '@/lib/admitCardServer'

export async function GET(req: NextRequest) {
    const { error, user } = requireAuth(req)
    if (error) return error

    try {
        const url = new URL(req.url)
        const courseId = url.searchParams.get('courseId')
        const batchId = url.searchParams.get('batchId')

        const where: any = { tenantId: user!.tenantId }
        if (courseId) where.courseId = courseId
        if (batchId) where.batchId = batchId

        const events = await prisma.admitCardEvent.findMany({
            where,
            include: {
                course: { select: { name: true } },
                batch: { select: { name: true } },
                _count: { select: { admitCards: true } }
            },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json({ success: true, data: events })
    } catch (err) {
        console.error('Fetch admit card events error:', err)
        return NextResponse.json({ error: 'Failed to fetch admit card events' }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    const { error, user } = requireAuth(req)
    if (error) return error

    try {
        const body = await req.json()
        const { courseId, batchId, examName, startDate, endDate, timeTable } = body

        if (!courseId || !examName || !startDate || !endDate) {
            return NextResponse.json({ error: 'Required fields missing: Class, Exam Name, Start Date, and End Date are mandatory' }, { status: 400 })
        }

        const result = await createAdmitCardEventWithRollNumbers({
            tenantId: user!.tenantId,
            userId: user!.userId,
            courseId,
            batchId,
            examName,
            startDate,
            endDate,
            timeTable: Array.isArray(timeTable) ? timeTable : [],
        })

        if ('error' in result) {
            return NextResponse.json({ error: result.error }, { status: 400 })
        }

        return NextResponse.json({ success: true, data: result.event }, { status: 201 })
    } catch (err) {
        console.error('Create admit card event error:', err)
        return NextResponse.json({ error: 'Failed to create admit card event' }, { status: 500 })
    }
}
