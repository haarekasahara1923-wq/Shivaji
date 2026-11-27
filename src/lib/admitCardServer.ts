import { prisma } from '@/lib/prisma'
import { generateClassWiseRollNumber } from '@/lib/admitCardUtils'

interface CreateEventParams {
  tenantId: string
  userId: string
  courseId: string
  batchId?: string | null
  examName: string
  startDate: string
  endDate: string
  timeTable?: any[]
}

/**
 * Creates an AdmitCardEvent for a class/section, excluding blocked and TC-generated students,
 * and assigns sequential class-wise roll numbers to each eligible student.
 */
export async function createAdmitCardEventWithRollNumbers({
  tenantId,
  userId,
  courseId,
  batchId,
  examName,
  startDate,
  endDate,
  timeTable = [],
}: CreateEventParams) {
  const course = await prisma.course.findFirst({
    where: { id: courseId, tenantId },
    select: { id: true, name: true },
  })
  if (!course) {
    throw new Error('Selected class/course not found')
  }

  let resolvedBatchId = batchId && batchId !== 'all' ? batchId : null
  if (!resolvedBatchId) {
    let existingBatch = await prisma.batch.findFirst({
      where: { tenantId, courseId, isActive: true },
    })
    if (!existingBatch) {
      existingBatch = await prisma.batch.create({
        data: {
          tenantId,
          courseId,
          name: 'Section A',
          isActive: true,
        },
      })
    }
    resolvedBatchId = existingBatch.id
  }

  const eligibleFilter: any = {
    tenantId,
    courseId,
    status: 'ACTIVE',
    tcGenerated: false,
    OR: [
      { userAccount: null },
      { userAccount: { isActive: true } },
    ],
  }

  if (batchId && batchId !== 'all') {
    const hasBatchStudents = await prisma.student.count({
      where: { ...eligibleFilter, batchId },
    })
    if (hasBatchStudents > 0) {
      eligibleFilter.batchId = batchId
    }
  }

  const students = await prisma.student.findMany({
    where: eligibleFilter,
    select: { id: true },
    orderBy: [{ fullName: 'asc' }, { createdAt: 'asc' }],
  })

  if (students.length === 0) {
    return { error: 'No eligible active students found in this class (blocked or TC-generated students are excluded).' }
  }

  const event = await prisma.admitCardEvent.create({
    data: {
      tenantId,
      courseId,
      batchId: resolvedBatchId,
      examName,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      createdBy: userId,
      timeTable,
      admitCards: {
        create: students.map((s, idx) => ({
          tenantId,
          studentId: s.id,
          rollNo: generateClassWiseRollNumber(course.name, idx + 1),
        })),
      },
    },
    include: {
      course: { select: { name: true } },
      batch: { select: { name: true } },
      _count: { select: { admitCards: true } },
    },
  })

  return { event }
}
