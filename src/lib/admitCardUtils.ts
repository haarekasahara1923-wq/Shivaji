/**
 * Shared helpers for class-wise Roll Number generation and Admit Card PDF/Print HTML.
 */

export function generateClassWiseRollNumber(className: string, sequenceIndex: number): string {
  const seq = Math.max(1, Math.floor(sequenceIndex))
  const normalized = (className || '').trim().toLowerCase()

  // Pre-primary classes
  if (/\bnurs[ae]ry\b/.test(normalized)) {
    return `N${String(seq).padStart(2, '0')}`
  }
  if (/\bl\.?\s*k\.?\s*g\.?\b/.test(normalized)) {
    return `L${String(seq).padStart(2, '0')}`
  }
  if (/\bu\.?\s*k\.?\s*g\.?\b/.test(normalized)) {
    return `U${String(seq).padStart(2, '0')}`
  }

  // Numeric classes 12 down to 1 (check 12, 11, 10 before 1, 2)
  const numMatch = normalized.match(/\b(1[0-2]|[1-9])(?:st|nd|rd|th)?\b/)
  if (numMatch) {
    const classNum = parseInt(numMatch[1], 10)
    return String(classNum * 100 + seq)
  }

  // Roman numeral fallback (XII down to I)
  const romanMap: Array<[RegExp, number]> = [
    [/\bxii\b/, 12],
    [/\bxi\b/, 11],
    [/\bx\b/, 10],
    [/\bix\b/, 9],
    [/\bviii\b/, 8],
    [/\bvii\b/, 7],
    [/\bvi\b/, 6],
    [/\biv\b/, 4],
    [/\bv\b/, 5],
    [/\biii\b/, 3],
    [/\bii\b/, 2],
    [/\bi\b/, 1],
  ]
  for (const [regex, num] of romanMap) {
    if (regex.test(normalized)) {
      return String(num * 100 + seq)
    }
  }

  // Generic fallback
  return `R${String(seq).padStart(2, '0')}`
}

export function getRollNumberPreview(className: string): string {
  if (!className) return ''
  return `${generateClassWiseRollNumber(className, 1)}, ${generateClassWiseRollNumber(className, 2)}, ${generateClassWiseRollNumber(className, 3)}...`
}

function fmtDate(d: string) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

function fmtTime(t: string) {
  if (!t) return ''
  const [h, m] = t.split(':').map(Number)
  if (isNaN(h) || isNaN(m)) return t
  const ampm = h >= 12 ? 'PM' : 'AM'
  const hr = h % 12 || 12
  return `${hr}:${m.toString().padStart(2, '0')} ${ampm}`
}

function computeDuration(start: string, end: string): string {
  if (!start || !end) return ''
  const [sh, sm] = start.split(':').map(Number)
  const [eh, em] = end.split(':').map(Number)
  const total = (eh * 60 + em) - (sh * 60 + sm)
  if (total <= 0) return ''
  const h = Math.floor(total / 60)
  const m = total % 60
  return h > 0 ? `${h}h ${m > 0 ? m + 'm' : ''}`.trim() : `${m}m`
}

/**
 * Generates printable A4 HTML for one or more admit cards.
 * Layout: Upper half = Admit Card (school header, student photo & details, roll no)
 *         Lower half = Examination Time Table, candidate instructions & signatures.
 */
export function generateAdmitCardsPrintHTML(eventDetails: any, tenant: any, cardsOverride?: any[]) {
  const schoolName = tenant?.name || 'School Management System Public School'
  const schoolLogo = tenant?.logo || ''
  const schoolAddress = tenant?.address || ''
  const schoolPhone = tenant?.phone || ''
  const schoolEmail = tenant?.email || ''
  const schoolCode = tenant?.schoolCode || ''
  const directorSign = tenant?.directorSign || ''

  const cardsToPrint = cardsOverride || (eventDetails.admitCards || [])
  const timeTable = Array.isArray(eventDetails.timeTable) ? eventDetails.timeTable : []

  const cardsHtml = cardsToPrint.map((card: any) => `
    <div class="admit-card-page">
      <div class="card-border">
        <div class="top-strip"></div>

        <!-- UPPER HALF: ADMIT CARD -->
        <div class="upper-half">
          <div class="header">
            <div class="logo-box">
              ${schoolLogo ? `<img src="${schoolLogo}" alt="Logo" onerror="this.parentElement.textContent='🏫'"/>` : '<span style="font-size:32px;">🏫</span>'}
            </div>
            <div class="header-text">
              <h1 class="school-name">${schoolName}</h1>
              ${schoolAddress ? `<p class="school-sub">${schoolAddress}</p>` : ''}
              <p class="school-contact">
                ${schoolPhone ? `📞 ${schoolPhone}` : ''}${schoolPhone && schoolEmail ? ' &nbsp;|&nbsp; ' : ''}${schoolEmail ? `✉ ${schoolEmail}` : ''}
                ${schoolCode ? ` &nbsp;|&nbsp; School Code: <strong>${schoolCode}</strong>` : ''}
              </p>
            </div>
            <div class="header-tag">
              <div class="tag-sub">HALL TICKET</div>
              <div class="tag-main">ADMIT CARD</div>
            </div>
          </div>

          <div class="exam-banner">
            ✦ &nbsp; ${eventDetails.examName} &nbsp; ✦
            <div style="font-size:11px;font-weight:600;margin-top:2px;letter-spacing:0.5px;opacity:0.9;">
              ${eventDetails.course?.name || ''}${eventDetails.batch?.name ? ' — ' + eventDetails.batch.name : ''}
            </div>
          </div>

          <div class="student-info-section">
            <div class="student-details-grid">
              <div class="detail-item">
                <span class="detail-label">ROLL NUMBER</span>
                <span class="detail-value roll-highlight">${card.rollNo || card.student?.scholarNo || 'N/A'}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">SCHOLAR / ADMISSION NO</span>
                <span class="detail-value">${card.student?.scholarNo || 'N/A'}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">STUDENT NAME</span>
                <span class="detail-value highlight">${card.student?.fullName || 'N/A'}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">CLASS & SECTION</span>
                <span class="detail-value">${eventDetails.course?.name || ''}${eventDetails.batch?.name ? ' - ' + eventDetails.batch.name : ''}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">FATHER'S NAME</span>
                <span class="detail-value">${card.student?.fatherName || 'N/A'}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">MOTHER'S NAME</span>
                <span class="detail-value">${card.student?.motherName || 'N/A'}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">DATE OF BIRTH</span>
                <span class="detail-value">${card.student?.dob ? fmtDate(card.student.dob) : 'N/A'}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">EXAMINATION DATES</span>
                <span class="detail-value">${fmtDate(eventDetails.startDate)} → ${fmtDate(eventDetails.endDate)}</span>
              </div>
            </div>

            <div class="photo-container">
              <div class="photo-box">
                ${card.student?.photo ? `<img src="${card.student.photo}" alt="Student Photo" />` : '<div style="font-size:36px;">👤</div><div style="font-size:9px;color:#64748b;margin-top:4px;">Affix Photo</div>'}
              </div>
            </div>
          </div>
        </div>

        <!-- LOWER HALF: EXAM TIME TABLE & INSTRUCTIONS -->
        <div class="lower-half">
          <div class="section-divider">
            <span>EXAMINATION TIME TABLE / SCHEDULE</span>
          </div>

          <table class="timetable-table">
            <thead>
              <tr>
                <th style="width:18%;">Date</th>
                <th style="width:38%;">Subject / Paper</th>
                <th style="width:26%;">Exam Time</th>
                <th style="width:18%;">Duration</th>
              </tr>
            </thead>
            <tbody>
              ${timeTable.length === 0 ? `
                <tr>
                  <td colspan="4" style="text-align:center;padding:12px;color:#64748b;">Schedule will be notified separately.</td>
                </tr>
              ` : timeTable.map((t: any) => `
                <tr>
                  <td style="font-weight:700;color:#1a237e;">${fmtDate(t.date)}</td>
                  <td style="font-weight:600;color:#0f172a;">${t.subject}</td>
                  <td>${fmtTime(t.startTime)} — ${fmtTime(t.endTime)}</td>
                  <td style="color:#64748b;">${t.duration || computeDuration(t.startTime, t.endTime) || '—'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="instructions-box">
            <div class="instructions-title">IMPORTANT CANDIDATE INSTRUCTIONS:</div>
            <ol class="instructions-list">
              <li>Candidate must carry this Admit Card & School ID Card to the examination hall for all papers.</li>
              <li>Report strictly 20 minutes before the scheduled exam commencement time.</li>
              <li>Mobile phones, smartwatches, calculators, and unfair means material are strictly prohibited.</li>
              <li>Maintain silence and strict discipline inside the examination hall.</li>
            </ol>
          </div>

          <div class="signatures-row">
            <div class="sig-block">
              <div class="sig-line"></div>
              <div class="sig-text">Candidate's Signature</div>
            </div>
            <div class="sig-block">
              <div class="sig-line"></div>
              <div class="sig-text">Class Teacher's Signature</div>
            </div>
            <div class="sig-block">
              <div class="sig-line">
                ${directorSign ? `<img src="${directorSign}" alt="Principal Signature" style="max-height:40px;max-width:140px;object-fit:contain;"/>` : ''}
              </div>
              <div class="sig-text">Principal / Controller of Exams</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `).join('')

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>Admit Cards – ${eventDetails.examName}</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Inter',sans-serif;background:#f1f5f9;margin:0;padding:20px;color:#1e293b;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
.admit-card-page{width:210mm;min-height:280mm;margin:0 auto 30px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 8px 30px rgba(0,0,0,0.12);page-break-after:always;display:flex;flex-direction:column;}
.card-border{border:2.5px solid #1a237e;border-radius:10px;margin:8px;padding:18px 20px;position:relative;flex:1;display:flex;flex-direction:column;justify-content:space-between;}
.top-strip{position:absolute;top:0;left:0;right:0;height:6px;background:linear-gradient(90deg,#1a237e,#2563eb,#fbbf24);}
.upper-half{display:flex;flex-direction:column;}
.lower-half{display:flex;flex-direction:column;margin-top:8px;border-top:2px dashed #cbd5e1;padding-top:10px;}
.header{display:flex;align-items:center;gap:16px;border-bottom:2px solid #1a237e;padding-bottom:12px;margin-top:4px;}
.logo-box{width:68px;height:68px;border-radius:10px;border:1.5px solid #cbd5e1;display:flex;align-items:center;justify-content:center;overflow:hidden;background:#f8fafc;flex-shrink:0;}
.logo-box img{width:100%;height:100%;object-fit:contain;}
.header-text{flex:1;}
.school-name{font-size:19px;font-weight:900;color:#1a237e;text-transform:uppercase;letter-spacing:0.5px;margin:0;}
.school-sub{font-size:11px;color:#475569;margin-top:2px;line-height:1.4;}
.school-contact{font-size:10px;color:#64748b;margin-top:2px;}
.header-tag{text-align:right;flex-shrink:0;}
.tag-sub{font-size:10px;font-weight:700;color:#64748b;letter-spacing:1px;text-transform:uppercase;}
.tag-main{font-size:18px;font-weight:900;color:#b45309;background:#fef3c7;padding:4px 10px;border-radius:6px;border:1px solid #fde68a;margin-top:2px;letter-spacing:0.5px;}

.exam-banner{background:linear-gradient(135deg,#fbbf24,#f59e0b);color:#1a237e;font-weight:900;text-align:center;padding:7px 12px;margin:12px 0;border-radius:6px;font-size:13px;text-transform:uppercase;letter-spacing:1.5px;}

.student-info-section{display:flex;gap:18px;align-items:flex-start;margin-bottom:8px;}
.student-details-grid{flex:1;display:grid;grid-template-columns:1fr 1fr;gap:9px 16px;}
.detail-item{border-bottom:1px solid #e2e8f0;padding-bottom:4px;}
.detail-label{display:block;font-size:9px;font-weight:700;color:#64748b;letter-spacing:0.5px;text-transform:uppercase;}
.detail-value{font-size:12.5px;font-weight:700;color:#0f172a;}
.detail-value.highlight{color:#1a237e;font-size:13.5px;font-weight:800;}
.detail-value.roll-highlight{color:#b45309;font-size:14px;font-weight:900;background:#fef3c7;padding:1px 6px;border-radius:4px;display:inline-block;margin-top:1px;}
.photo-container{width:96px;flex-shrink:0;text-align:center;}
.photo-box{width:96px;height:116px;border:1.5px solid #1a237e;border-radius:6px;background:#f8fafc;display:flex;flex-direction:column;align-items:center;justify-content:center;overflow:hidden;}
.photo-box img{width:100%;height:100%;object-fit:cover;}

.section-divider{display:flex;align-items:center;margin:6px 0 8px 0;text-align:center;}
.section-divider::before,.section-divider::after{content:'';flex:1;border-bottom:1.5px solid #cbd5e1;}
.section-divider span{padding:0 10px;font-size:11px;font-weight:800;color:#1a237e;letter-spacing:1px;text-transform:uppercase;}

.timetable-table{width:100%;border-collapse:collapse;font-size:11px;margin-bottom:10px;border-radius:6px;overflow:hidden;border:1px solid #cbd5e1;}
.timetable-table th{background:#1a237e;color:#fff;padding:6px 10px;text-align:left;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;font-size:10px;}
.timetable-table td{border-bottom:1px solid #e2e8f0;padding:6px 10px;text-align:left;}
.timetable-table tr:nth-child(even){background:#f8fafc;}

.instructions-box{background:#fffbeb;border:1px solid #fde68a;border-radius:6px;padding:8px 12px;margin-bottom:12px;}
.instructions-title{font-size:10px;font-weight:800;color:#92400e;letter-spacing:0.5px;}
.instructions-list{margin:4px 0 0;padding-left:16px;font-size:9.5px;color:#78350f;line-height:1.5;}

.signatures-row{display:flex;justify-content:space-between;align-items:flex-end;margin-top:12px;padding:0 10px;}
.sig-block{text-align:center;width:150px;}
.sig-line{height:42px;border-bottom:1.5px solid #1e293b;margin-bottom:4px;display:flex;align-items:flex-end;justify-content:center;}
.sig-text{font-size:10px;font-weight:700;color:#475569;}

@media print{
  body{background:#fff;padding:0;}
  .admit-card-page{width:100%;min-height:278mm;margin:0;box-shadow:none;page-break-after:always;}
  .card-border{border:2px solid #1a237e;margin:0;padding:16px 18px;}
  @page{size:A4 portrait;margin:8mm;}
}
</style>
</head>
<body>
  ${cardsHtml}
  <script>window.onload=function(){window.print();}</script>
</body>
</html>`
}
