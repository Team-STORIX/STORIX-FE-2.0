'use client'

type Props =
  | {
      type: 'date'
      /** "2026-01-17" / ISO / Date 모두 가능 */
      date: string | Date
      className?: string
    }
  | {
      type: 'presence'
      /** 입장/퇴장 */
      action: 'enter' | 'leave'
      /** "나는유저1" 같은 표시 이름 */
      userName: string
      className?: string
    }

function formatKoreanDate(input: string | Date) {
  const d = typeof input === 'string' ? new Date(input) : input
  if (Number.isNaN(d.getTime())) return ''

  const y = d.getFullYear()
  const m = d.getMonth() + 1
  const day = d.getDate()

  const dow = ['일', '월', '화', '수', '목', '금', '토'][d.getDay()]
  return `${y}년 ${m}월 ${day}일 ${dow}요일`
}

export default function TopicroomChip(props: Props) {
  if (props.type === 'date') {
    const label = formatKoreanDate(props.date)

    return (
      <div
        className={['w-full flex justify-center', props.className ?? ''].join(
          ' ',
        )}
      >
        <div
          className={[
            'px-4 py-1.5 rounded-full',
            'bg-gray-50',
            'caption-1 text-gray-400',
          ].join(' ')}
        >
          {label}
        </div>
      </div>
    )
  }

  // presence
  const text =
    props.action === 'enter'
      ? `${props.userName}님이 들어왔습니다.`
      : `${props.userName}님이 나갔습니다.`

  return (
    <div
      className={['w-full flex justify-center', props.className ?? ''].join(
        ' ',
      )}
    >
      <div
        className={[
          'px-4 py-1.5 rounded-full',
          'bg-gray-50',
          'caption-1 text-gray-400',
        ].join(' ')}
      >
        {text}
      </div>
    </div>
  )
}
