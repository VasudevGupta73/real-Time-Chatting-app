import React, { useState } from 'react'

/**
 * SenderMessage — right-aligned chat bubble for the logged-in user.
 *
 * Props:
 *  message  : string   — text body (optional if image present)
 *  image    : string   — image URL (optional)
 *  timestamp: Date | string — when the message was sent
 *  status   : 'sent' | 'delivered' | 'read'  (default: 'sent')
 */
const SenderMessage = ({ message, image, timestamp, status = 'sent' }) => {
  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgError, setImgError] = useState(false)

  const formatTime = (ts) => {
    const date = new Date(ts)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  // Double-tick SVG for delivered / read
  const Ticks = () => {
    const color = status === 'read' ? '#60a5fa' : '#cbd5e1' // blue-400 or slate-300
    if (status === 'sent') {
      return (
        <svg className='w-3.5 h-3.5 inline-block' viewBox='0 0 16 16' fill='none'>
          <path d='M3 8l4 4 6-7' stroke='#cbd5e1' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
        </svg>
      )
    }
    return (
      <svg className='w-4 h-4 inline-block' viewBox='0 0 20 16' fill='none'>
        <path d='M1 8l4 4L11 5' stroke={color} strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
        <path d='M6 8l4 4 6-7' stroke={color} strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
      </svg>
    )
  }

  return (
    <div className='flex justify-end items-end gap-2 group px-2 py-0.5 animate-slideInRight'>
      {/* Bubble */}
      <div className='flex flex-col items-end max-w-xs lg:max-w-sm'>

        {/* Image attachment */}
        {image && !imgError && (
          <div className='mb-1 rounded-2xl rounded-br-sm overflow-hidden shadow-md relative'>
            {/* Skeleton while loading */}
            {!imgLoaded && (
              <div className='w-52 h-40 bg-gradient-to-br from-blue-300 to-blue-500 animate-pulse rounded-2xl' />
            )}
            <img
              src={image}
              alt='attachment'
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
              className={`w-52 object-cover rounded-2xl rounded-br-sm cursor-pointer
                hover:brightness-90 transition-all duration-200
                ${imgLoaded ? 'block' : 'hidden'}`}
            />
            {/* Timestamp overlay on image when no text */}
            {!message && (
              <div className='absolute bottom-1.5 right-2 flex items-center gap-1'>
                <span className='text-[10px] text-white/90 drop-shadow'>
                  {formatTime(timestamp)}
                </span>
                <Ticks />
              </div>
            )}
          </div>
        )}

        {/* Text bubble */}
        {message && (
          <div
            className='
              relative px-4 py-2.5
              bg-gradient-to-br from-blue-500 to-blue-600
              text-white text-sm leading-relaxed
              rounded-2xl rounded-br-none
              shadow-md shadow-blue-200
              break-words
            '
          >
            {/* Tail */}
            <span
              className='
                absolute -bottom-0 -right-1.5
                w-3 h-3 bg-blue-600
                clip-tail
              '
              style={{
                clipPath: 'polygon(0 0, 100% 0, 0 100%)',
                borderBottomRightRadius: '2px',
              }}
            />

            <p className='pr-14'>{message}</p>

            {/* Timestamp + ticks inside bubble */}
            <div className='absolute bottom-1.5 right-3 flex items-center gap-1 opacity-80'>
              <span className='text-[10px] text-white/90'>
                {formatTime(timestamp)}
              </span>
              <Ticks />
            </div>
          </div>
        )}

        {/* Timestamp below image (when there IS text too) */}
        {image && message && (
          <div className='flex items-center gap-1 mt-0.5 opacity-60'>
            <span className='text-[10px] text-gray-500'>
              {formatTime(timestamp)}
            </span>
            <Ticks />
          </div>
        )}

        {/* Timestamp when image-only and it loaded with error */}
        {imgError && (
          <div className='flex items-center gap-1 mt-0.5 opacity-60'>
            <span className='text-[10px] text-gray-500'>
              {formatTime(timestamp)}
            </span>
            <Ticks />
          </div>
        )}
      </div>
    </div>
  )
}

export default SenderMessage
