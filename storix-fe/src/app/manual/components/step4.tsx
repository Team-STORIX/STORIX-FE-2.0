// src/app/manual/components/step4.tsx
export default function Step4() {
  return (
    <div className="flex justify-center items-center">
      <div
        className="relative flex justify-center items-center"
        style={{ transform: 'rotate(90deg)' }}
      >
        {/* 외부 테두리 */}
        <div
          className="absolute"
          style={{
            width: '605.131px',
            height: '285.507px',
            border: '2px solid #050505',
          }}
        />
        {/* 내부 배경 */}
        <div
          style={{
            width: '582.893px',
            height: '263.269px',
            backgroundColor: '#DADADA',
          }}
        />
      </div>
    </div>
  )
}
