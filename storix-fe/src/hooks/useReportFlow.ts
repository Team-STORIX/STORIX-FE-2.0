// src/hooks/useReportFlow.ts
'use client'

import { useEffect, useRef, useState } from 'react'

export type BaseReportTarget = {
  profileImage: string
  nickname: string
}

export type ReportConfirmOutcome =
  | void
  | { status: 'ok' }
  | { status: 'duplicated'; message?: string }

export function useReportFlow<T extends BaseReportTarget>(opts: {
  onConfirm: (target: T) => ReportConfirmOutcome | Promise<ReportConfirmOutcome>
  doneDurationMs?: number
  toastDurationMs?: number
  duplicatedMessage?: string
}) {
  const doneMs = opts.doneDurationMs ?? 5000
  const toastMs = opts.toastDurationMs ?? 2500
  const duplicatedDefault = opts.duplicatedMessage ?? '이미 신고한 글이에요.'

  const [isReportOpen, setIsReportOpen] = useState(false)
  const [reportTarget, setReportTarget] = useState<T | null>(null)

  const [reportDoneOpen, setReportDoneOpen] = useState(false)
  const timerRef = useRef<number | null>(null)

  //   toast
  const [toastOpen, setToastOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const toastTimerRef = useRef<number | null>(null)

  const clearTimer = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  const clearToastTimer = () => {
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current)
      toastTimerRef.current = null
    }
  }

  const openToast = (msg: string) => {
    clearToastTimer()
    setToastMessage(msg)
    setToastOpen(true)
    toastTimerRef.current = window.setTimeout(() => {
      setToastOpen(false)
      toastTimerRef.current = null
    }, toastMs)
  }

  const closeToast = () => {
    clearToastTimer()
    setToastOpen(false)
  }

  const openReportModal = (t: T) => {
    setReportTarget(t)
    setIsReportOpen(true)
  }

  const closeReportModal = () => {
    setIsReportOpen(false)
    setReportTarget(null)
  }

  const openDone = () => {
    clearTimer()
    setReportDoneOpen(true)
    timerRef.current = window.setTimeout(() => {
      setReportDoneOpen(false)
      timerRef.current = null
    }, doneMs)
  }

  const closeReportDone = () => {
    clearTimer()
    setReportDoneOpen(false)
  }

  const handleReportConfirm = async () => {
    if (!reportTarget) return
    try {
      const out = await opts.onConfirm(reportTarget)

      //   duplicated 처리
      if (
        out &&
        typeof out === 'object' &&
        'status' in out &&
        out.status === 'duplicated'
      ) {
        closeReportModal()
        openToast(out.message ?? duplicatedDefault)
        return
      }

      //   ok(혹은 void면 ok로 처리)
      closeReportModal()
      openDone()
    } catch (err) {
      console.error('[report] failed:', err)
      closeReportModal()
    }
  }

  // ESC 닫기
  useEffect(() => {
    if (!isReportOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeReportModal()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isReportOpen])

  // unmount cleanup
  useEffect(() => {
    return () => {
      clearTimer()
      clearToastTimer()
    }
  }, [])

  return {
    isReportOpen,
    reportTarget,
    reportDoneOpen,
    openReportModal,
    closeReportModal,
    handleReportConfirm,
    confirmReport: handleReportConfirm,
    closeReportDone,

    //   toast
    toastOpen,
    toastMessage,
    closeToast,
  }
}
