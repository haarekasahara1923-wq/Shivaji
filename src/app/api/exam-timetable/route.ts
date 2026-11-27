import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/app/api/middleware'
import { prisma } from '@/lib/prisma'
import { createAdmitCardEventWithRollNumbers } from '@/lib/admitCardServer'

export const dynamic = 'force-dynamic'

// GET — list all exam timetables for the tenant
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
        _count: { select: { admitCards: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, data: events })
  } catch (err) {
    console.error('Fetch exam timetable error:', err)
    return NextResponse.json({ error: 'Failed to fetch exam timetables' }, { status: 500 })
  }
}

// POST — create a new exam timetable & generate class-wise admit cards with sequential roll numbers
export async function POST(req: NextRequest) {
  const { error, user } = requireAuth(req)
  if (error) return error

  try {
    const body = await req.json()
    const { examName, courseId, batchId, startDate, endDate, timeTable } = body

    if (!examName || !courseId || !startDate || !endDate || !Array.isArray(timeTable) || timeTable.length === 0) {
      return NextResponse.json({ error: 'Required fields missing: Exam Name, Class, Start Date, End Date, and Subjects are required' }, { status: 400 })
    }

    const result = await createAdmitCardEventWithRollNumbers({
      tenantId: user!.tenantId,
      userId: user!.userId,
      courseId,
      batchId,
      examName,
      startDate,
      endDate,
      timeTable,
    })

    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({ success: true, data: result.event }, { status: 201 })
  } catch (err) {
    console.error('Create exam timetable error:', err)
    return NextResponse.json({ error: 'Failed to create exam timetable' }, { status: 500 })
  }
}
