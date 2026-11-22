import 'dotenv/config'
import bcrypt from 'bcryptjs'
import pg from 'pg'
const { Pool } = pg

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } })

  // ---- Tenant 1: MJF Convent School ----
  const r1 = await pool.query(
    'INSERT INTO "Tenant" (id,name,slug,"themeColor",address,phone,email,"isActive","createdAt","updatedAt") VALUES ($1,$2,$3,$4,$5,$6,$7,true,NOW(),NOW()) ON CONFLICT (slug) DO UPDATE SET name=$2,"themeColor"=$4,address=$5,phone=$6,email=$7 RETURNING id',
    ['tenant_mjf','MJF Convent School','mjf','#f97316','MJF Convent School, City (State)','91XXXXXXXXXX','info@mjfconvent.school']
  )
  const tid1 = r1.rows[0].id
  console.log('Tenant 1 (MJF):', tid1)

  const sp1 = await bcrypt.hash('mjf@super2026', 10)
  await pool.query('INSERT INTO "User" (id,"tenantId",email,phone,password,name,role,"isActive","createdAt","updatedAt") VALUES ($1,$2,$3,$4,$5,$6,$7,true,NOW(),NOW()) ON CONFLICT ("tenantId",email) DO UPDATE SET password=$5,name=$6',
    ['user_mjf_super',tid1,'superadmin@mjfconvent.school','91XXXXXXXXXX',sp1,'MJF Super Admin','SUPER_ADMIN'])
  const ap1 = await bcrypt.hash('mjf@admin2026', 10)
  await pool.query('INSERT INTO "User" (id,"tenantId",email,phone,password,name,role,"isActive","createdAt","updatedAt") VALUES ($1,$2,$3,$4,$5,$6,$7,true,NOW(),NOW()) ON CONFLICT ("tenantId",email) DO UPDATE SET password=$5,name=$6',
    ['user_mjf_admin',tid1,'admin@mjfconvent.school','91XXXXXXXXXX',ap1,'School Administrator','COACHING_ADMIN'])
  const tp1 = await bcrypt.hash('teacher@mjf2026', 10)
  await pool.query('INSERT INTO "User" (id,"tenantId",email,phone,password,name,role,"isActive","createdAt","updatedAt") VALUES ($1,$2,$3,$4,$5,$6,$7,true,NOW(),NOW()) ON CONFLICT ("tenantId",email) DO UPDATE SET password=$5,name=$6',
    ['user_mjf_teacher',tid1,'teacher@mjfconvent.school','9876543211',tp1,'Demo Teacher','TEACHER'])
  console.log('MJF Users OK')

  const courses1 = [
    ['course_mjf_1','Class 6','Std 6','1 Year',12000,'{Hindi,English,Maths,Science}'],
    ['course_mjf_2','Class 7','Std 7','1 Year',12000,'{Hindi,English,Maths,Science}'],
    ['course_mjf_3','Class 8','Std 8','1 Year',13000,'{Hindi,English,Maths,Science}'],
    ['course_mjf_4','Class 9','Std 9','1 Year',15000,'{Hindi,English,Maths,Science}'],
    ['course_mjf_5','Class 10','Std 10','1 Year',18000,'{Hindi,English,Maths,Science}'],
    ['course_mjf_6','Class 11 Sci','Sci 11','1 Year',22000,'{Physics,Chemistry,Maths}'],
    ['course_mjf_7','Class 12 Sci','Sci 12','1 Year',24000,'{Physics,Chemistry,Maths}'],
    ['course_mjf_8','Class 11 Com','Com 11','1 Year',20000,'{Accountancy,Economics}'],
    ['course_mjf_9','Class 12 Com','Com 12','1 Year',22000,'{Accountancy,Economics}'],
  ]
  for (const c of courses1) {
    await pool.query('INSERT INTO "Course" (id,"tenantId",name,description,duration,fees,subjects,"isActive","createdAt","updatedAt") VALUES ($1,$2,$3,$4,$5,$6,$7,true,NOW(),NOW()) ON CONFLICT DO NOTHING',
      [c[0],tid1,c[1],c[2],c[3],c[4],c[5]])
  }
  console.log('MJF Courses OK')

  const batches1 = [
    ['batch_mjf_1','course_mjf_1','Class 6-A','08:00','14:00',40],
    ['batch_mjf_2','course_mjf_2','Class 7-A','08:00','14:00',40],
    ['batch_mjf_3','course_mjf_3','Class 8-A','08:00','14:00',40],
    ['batch_mjf_4','course_mjf_4','Class 9-A','08:00','14:00',40],
    ['batch_mjf_5','course_mjf_5','Class 10-A','08:00','14:00',40],
    ['batch_mjf_6','course_mjf_6','Class 11 Sci','08:00','14:30',35],
    ['batch_mjf_7','course_mjf_7','Class 12 Sci','08:00','14:30',35],
    ['batch_mjf_8','course_mjf_8','Class 11 Com','08:00','14:00',35],
    ['batch_mjf_9','course_mjf_9','Class 12 Com','08:00','14:00',35],
  ]
  for (const b of batches1) {
    await pool.query('INSERT INTO "Batch" (id,"tenantId","courseId",name,"startTime","endTime",capacity,"isActive","createdAt","updatedAt") VALUES ($1,$2,$3,$4,$5,$6,$7,true,NOW(),NOW()) ON CONFLICT DO NOTHING',
      [b[0],tid1,b[1],b[2],b[3],b[4],b[5]])
  }
  console.log('MJF Batches OK')

  const studs1 = [
    ['stu_mjf_1','Arjun Sharma','9876501001','Ramesh Sharma','course_mjf_5','batch_mjf_5',18000,9000,'MJF001'],
    ['stu_mjf_2','Priya Verma','9876502001','Suresh Verma','course_mjf_7','batch_mjf_7',24000,24000,'MJF002'],
    ['stu_mjf_3','Rahul Gupta','9876503001','Mahesh Gupta','course_mjf_4','batch_mjf_4',15000,7500,'MJF003'],
  ]
  for (const s of studs1) {
    await pool.query('INSERT INTO "Student" (id,"tenantId","courseId","batchId","studentId","fullName","fatherName",phone,gender,"totalFee","paidFee",status,"admissionDate","createdAt","updatedAt") VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,NOW(),NOW(),NOW()) ON CONFLICT DO NOTHING',
      [s[0],tid1,s[4],s[5],s[8],s[1],s[3],s[2],'MALE',s[6],s[7],'ACTIVE'])
  }
  console.log('MJF Students OK')

  await pool.query('INSERT INTO "Subscription" (id,"tenantId",plan,status,amount,"createdAt","updatedAt") VALUES ($1,$2,$3,$4,$5,NOW(),NOW()) ON CONFLICT ("tenantId") DO UPDATE SET plan=$3,status=$4',
    ['sub_mjf',tid1,'ELITE','ACTIVE',0])
  console.log('MJF Subscription OK')

  // ---- Tenant 2: Chhatrapati Shivaji Higher Secondary School ----
  const r2 = await pool.query(
    'INSERT INTO "Tenant" (id,name,slug,"themeColor",address,phone,email,"isActive","createdAt","updatedAt") VALUES ($1,$2,$3,$4,$5,$6,$7,true,NOW(),NOW()) ON CONFLICT (slug) DO UPDATE SET name=$2,"themeColor"=$4,address=$5,phone=$6,email=$7 RETURNING id',
    ['tenant_shivaji','Chhatrapati Shivaji Higher Secondary School','shivaji','#1a5c38','Chhatrapati Shivaji HSS, City (State)','91XXXXXXXXXX','info@shivajihss.school']
  )
  const tid2 = r2.rows[0].id
  console.log('Tenant 2 (Shivaji):', tid2)

  const sp2 = await bcrypt.hash('shivaji@super2026', 10)
  await pool.query('INSERT INTO "User" (id,"tenantId",email,phone,password,name,role,"isActive","createdAt","updatedAt") VALUES ($1,$2,$3,$4,$5,$6,$7,true,NOW(),NOW()) ON CONFLICT ("tenantId",email) DO UPDATE SET password=$5,name=$6',
    ['user_shivaji_super',tid2,'superadmin@shivajihss.school','91XXXXXXXXXX',sp2,'Shivaji Super Admin','SUPER_ADMIN'])
  const ap2 = await bcrypt.hash('shivaji@admin2026', 10)
  await pool.query('INSERT INTO "User" (id,"tenantId",email,phone,password,name,role,"isActive","createdAt","updatedAt") VALUES ($1,$2,$3,$4,$5,$6,$7,true,NOW(),NOW()) ON CONFLICT ("tenantId",email) DO UPDATE SET password=$5,name=$6',
    ['user_shivaji_admin',tid2,'admin@shivajihss.school','91XXXXXXXXXX',ap2,'School Administrator','COACHING_ADMIN'])
  const tp2 = await bcrypt.hash('teacher@shivaji2026', 10)
  await pool.query('INSERT INTO "User" (id,"tenantId",email,phone,password,name,role,"isActive","createdAt","updatedAt") VALUES ($1,$2,$3,$4,$5,$6,$7,true,NOW(),NOW()) ON CONFLICT ("tenantId",email) DO UPDATE SET password=$5,name=$6',
    ['user_shivaji_teacher',tid2,'teacher@shivajihss.school','9876543212',tp2,'Demo Teacher','TEACHER'])
  console.log('Shivaji Users OK')

  const courses2 = [
    ['course_shivaji_1','Class 11 Sci','Sci 11','1 Year',22000,'{Physics,Chemistry,Maths,Biology}'],
    ['course_shivaji_2','Class 12 Sci','Sci 12','1 Year',24000,'{Physics,Chemistry,Maths,Biology}'],
    ['course_shivaji_3','Class 11 Com','Com 11','1 Year',20000,'{Accountancy,Economics,Business}'],
    ['course_shivaji_4','Class 12 Com','Com 12','1 Year',22000,'{Accountancy,Economics,Business}'],
    ['course_shivaji_5','Class 11 Arts','Arts 11','1 Year',18000,'{History,Geography,Civics}'],
    ['course_shivaji_6','Class 12 Arts','Arts 12','1 Year',20000,'{History,Geography,Civics}'],
  ]
  for (const c of courses2) {
    await pool.query('INSERT INTO "Course" (id,"tenantId",name,description,duration,fees,subjects,"isActive","createdAt","updatedAt") VALUES ($1,$2,$3,$4,$5,$6,$7,true,NOW(),NOW()) ON CONFLICT DO NOTHING',
      [c[0],tid2,c[1],c[2],c[3],c[4],c[5]])
  }
  console.log('Shivaji Courses OK')

  const batches2 = [
    ['batch_shivaji_1','course_shivaji_1','Sci 11-A','07:30','13:30',45],
    ['batch_shivaji_2','course_shivaji_2','Sci 12-A','07:30','13:30',45],
    ['batch_shivaji_3','course_shivaji_3','Com 11-A','07:30','13:30',40],
    ['batch_shivaji_4','course_shivaji_4','Com 12-A','07:30','13:30',40],
    ['batch_shivaji_5','course_shivaji_5','Arts 11-A','07:30','13:30',40],
    ['batch_shivaji_6','course_shivaji_6','Arts 12-A','07:30','13:30',40],
  ]
  for (const b of batches2) {
    await pool.query('INSERT INTO "Batch" (id,"tenantId","courseId",name,"startTime","endTime",capacity,"isActive","createdAt","updatedAt") VALUES ($1,$2,$3,$4,$5,$6,$7,true,NOW(),NOW()) ON CONFLICT DO NOTHING',
      [b[0],tid2,b[1],b[2],b[3],b[4],b[5]])
  }
  console.log('Shivaji Batches OK')

  const studs2 = [
    ['stu_shivaji_1','Meera Patil','9876504001','Sunil Patil','course_shivaji_1','batch_shivaji_1',22000,11000,'CSHSS001'],
    ['stu_shivaji_2','Ravi Deshmukh','9876505001','Anil Deshmukh','course_shivaji_2','batch_shivaji_2',24000,24000,'CSHSS002'],
    ['stu_shivaji_3','Pooja More','9876506001','Vinod More','course_shivaji_3','batch_shivaji_3',20000,10000,'CSHSS003'],
  ]
  for (const s of studs2) {
    await pool.query('INSERT INTO "Student" (id,"tenantId","courseId","batchId","studentId","fullName","fatherName",phone,gender,"totalFee","paidFee",status,"admissionDate","createdAt","updatedAt") VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,NOW(),NOW(),NOW()) ON CONFLICT DO NOTHING',
      [s[0],tid2,s[4],s[5],s[8],s[1],s[3],s[2],'FEMALE',s[6],s[7],'ACTIVE'])
  }
  console.log('Shivaji Students OK')

  await pool.query('INSERT INTO "Subscription" (id,"tenantId",plan,status,amount,"createdAt","updatedAt") VALUES ($1,$2,$3,$4,$5,NOW(),NOW()) ON CONFLICT ("tenantId") DO UPDATE SET plan=$3,status=$4',
    ['sub_shivaji',tid2,'ELITE','ACTIVE',0])
  console.log('Shivaji Subscription OK')

  await pool.end()
  console.log('')
  console.log('=== SCHOOL ERP SEED COMPLETE ===')
  console.log('')
  console.log('-- MJF Convent School --')
  console.log('superadmin@mjfconvent.school / mjf@super2026')
  console.log('admin@mjfconvent.school / mjf@admin2026')
  console.log('teacher@mjfconvent.school / teacher@mjf2026')
  console.log('NEXT_PUBLIC_SCHOOL_TENANT_ID=' + tid1)
  console.log('')
  console.log('-- Chhatrapati Shivaji HSS --')
  console.log('superadmin@shivajihss.school / shivaji@super2026')
  console.log('admin@shivajihss.school / shivaji@admin2026')
  console.log('teacher@shivajihss.school / teacher@shivaji2026')
  console.log('NEXT_PUBLIC_SCHOOL_TENANT_ID=' + tid2)
}
main().catch(e => { console.error('SEED FAILED:', e.message); process.exit(1) })