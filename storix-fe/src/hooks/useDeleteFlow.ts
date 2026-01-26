// src/hooks/useDeleteFlow.ts
'use client'

import { useEffect, useRef, useState } from 'react'

export function useDeleteFlow<T>(opts: {
  onConfirm: (target: T) => void | Promise<void>
  doneDurationMs?: number
}) {
  const doneMs = opts.doneDurationMs ?? 5000

  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<T | null>(null)

  const [deleteDoneOpen, setDeleteDoneOpen] = useState(false)
  const timerRef = useRef<number | null>(null)

  const clearTimer = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  const openDeleteModal = (t: T) => {
    setDeleteTarget(t)
    setIsDeleteOpen(true)
  }

  const closeDeleteModal = () => {
    setIsDeleteOpen(false)
    setDeleteTarget(null)
  }

  const openDone = () => {
    clearTimer()
    setDeleteDoneOpen(true)
    timerRef.current = window.setTimeout(() => {
      setDeleteDoneOpen(false)
      timerRef.current = null
    }, doneMs)
  }

  const closeDeleteDone = () => {
    clearTimer()
    setDeleteDoneOpen(false)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    try {
      await opts.onConfirm(deleteTarget)
      closeDeleteModal()
      openDone()
    } catch (err) {
      //console.error('[delete] failed:', err)
      closeDeleteModal()
    }
  }

  // ESC 닫기
  useEffect(() => {
    if (!isDeleteOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDeleteModal()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isDeleteOpen])

  // unmount cleanup
  useEffect(() => {
    return () => clearTimer()
  }, [])

  return {
    isDeleteOpen,
    deleteTarget,
    deleteDoneOpen,
    openDeleteModal,
    closeDeleteModal,
    handleDeleteConfirm,
    confirmDelete: handleDeleteConfirm,
    closeDeleteDone,
  }
}
