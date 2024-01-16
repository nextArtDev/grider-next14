'use client'
import { Loader2 } from 'lucide-react'
import React, { useMemo } from 'react'

// import './OtpInput.css'

export type Props = {
  value: string
  valueLength: number
  onChange: (value: string) => void
  onComplete?: () => void
  disabled?: boolean
}

export default function OtpInput({
  value,
  valueLength = 6,
  onChange,
  onComplete,
  disabled,
}: Props) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const RE_DIGIT = new RegExp(/^\d+$/)
  const valueItems = useMemo(() => {
    const valueArray = value?.split('')
    const items: Array<string> = []

    for (let i = 0; i < valueLength; i++) {
      const char = valueArray[i]

      if (RE_DIGIT.test(char)) {
        items.push(char)
      } else {
        items.push('')
      }
    }

    return items
  }, [RE_DIGIT, value, valueLength])

  const focusToNextInput = (target: HTMLElement) => {
    const nextElementSibling =
      target.nextElementSibling as HTMLInputElement | null

    if (nextElementSibling) {
      nextElementSibling.focus()
    }
  }
  const focusToPrevInput = (target: HTMLElement) => {
    const previousElementSibling =
      target.previousElementSibling as HTMLInputElement | null

    if (previousElementSibling) {
      previousElementSibling.focus()
    }
  }
  const inputOnChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number
  ) => {
    const target = e.target
    let targetValue = target.value.trim()
    const isTargetValueDigit = RE_DIGIT.test(targetValue)

    if (!isTargetValueDigit && targetValue !== '') {
      return
    }

    const nextInputEl = target.nextElementSibling as HTMLInputElement | null

    // only delete digit if next input element has no value
    if (!isTargetValueDigit && nextInputEl && nextInputEl.value !== '') {
      return
    }

    targetValue = isTargetValueDigit ? targetValue : ' '

    const targetValueLength = targetValue.length

    if (targetValueLength === 1) {
      const newValue =
        value.substring(0, idx) + targetValue + value.substring(idx + 1)

      onChange(newValue)

      // For Automatically submission-1
      if (newValue.length === valueLength && onComplete) {
        // Check if all digits are filled and call onComplete
        onComplete()
      }

      if (!isTargetValueDigit) {
        return
      }

      focusToNextInput(target)
    } else if (targetValueLength === valueLength) {
      onChange(targetValue)
      // For Automatically submission -2
      if (onComplete) {
        // Check if all digits are filled and call onComplete
        onComplete()
      }

      target.blur()
    }
  }
  const inputOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { key } = e
    const target = e.target as HTMLInputElement

    if (key === 'ArrowRight' || key === 'ArrowDown') {
      e.preventDefault()
      return focusToNextInput(target)
    }

    if (key === 'ArrowLeft' || key === 'ArrowUp') {
      e.preventDefault()
      return focusToPrevInput(target)
    }

    const targetValue = target.value

    // keep the selection range position
    // if the same digit was typed
    target.setSelectionRange(0, targetValue.length)

    if (e.key !== 'Backspace' || targetValue !== '') {
      return
    }

    focusToPrevInput(target)
  }
  const inputOnFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const { target } = e

    // keep focusing back until previous input
    // element has value
    const prevInputEl = target.previousElementSibling as HTMLInputElement | null

    if (prevInputEl && prevInputEl.value === '') {
      return prevInputEl.focus()
    }

    target.setSelectionRange(0, target.value.length)
  }

  return (
    <div className="otp-group flex w-full max-w-[360px]">
      {!disabled ? (
        valueItems.map((digit, idx) => (
          <input
            disabled={disabled}
            key={idx}
            type={'text'}
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="\d{1}"
            maxLength={valueLength}
            className="otp-input w-full h-14 border border-[#ccc] rounded-sm p-0 text-center text-[32px] font-bold "
            value={digit}
            onChange={(e) => inputOnChange(e, idx)}
            onKeyDown={inputOnKeyDown}
            onFocus={inputOnFocus}
          />
        ))
      ) : (
        <Loader2 className="animate-spin w-12 h-12 opacity-55 " />
      )}
    </div>
  )
}
