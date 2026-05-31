import React, { useState } from 'react'

/**
 * ReceiverMessage — left-aligned chat bubble for the other user.
 *
 * Props:
 *  message    : string        — text body (optional if image present)
 *  image      : string        — image URL (optional)
 *  timestamp  : Date | string — when the message was sent
 *  senderName : string        — display name of the sender
 *  senderAvatar: string       — avatar URL (optional, falls back to initial)
 */
const ReceiverMessage = ({ message, image, timestamp, senderName, senderAvatar }) => {
  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgError, setImgError] = useState(false)
  const [avatarError, setAvatarError] = useState(false)

  const formatTime = (ts) => {
    const date = new Date(ts)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const initial = senderName?.charAt(0)?.toUpperCase() || '?'

  return (
    <div className='flex justify-start items-end gap-2 group px-2 py-0.5 animate-slideInLeft'>

      {/* Avatar */}
      <div className='flex-shrink-0 mb-1'>
        {senderAvatar && !avatarError ? (
          <img
            src={senderAvatar}
            alt={senderName}
            onError={() => setAvatarError(true)}
            className='w-8 h-8 rounded-full object-cover ring-2 ring-white shadow-sm'
          />
        ) : (
          <div className='w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center text-white text-xs font-semibold ring-2 ring-white shadow-sm'>
            {initial}
          </div>
        )}
      </div>

      {/* Bubble column */}
      <div className='flex flex-col items-start max-w-xs lg:max-w-sm'>

        {/* Sender name */}
        {senderName && (
          <span className='text-[11px] font-semibold text-purple-600 mb-0.5 ml-1 tracking-wide'>
            {senderName}
          </span>
        )}

        {/* Image attachment */}
        {image && !imgError && (
          <div className='mb-1 rounded-2xl rounded-bl-sm overflow-hidden shadow-md relative'>
            {/* Skeleton while loading */}
            {!imgLoaded && (
              <div className='w-52 h-40 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse rounded-2xl' />
            )}
            <img
              src={image}
              alt='attachment'
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
              className={`w-52 object-cover rounded-2xl rounded-bl-sm cursor-pointer
                hover:brightness-90 transition-all duration-200
                ${imgLoaded ? 'block' : 'hidden'}`}
            />
            {/* Timestamp overlay on image when no text */}
            {!message && (
              <div className='absolute bottom-1.5 left-2'>
                <span className='text-[10px] text-white/90 drop-shadow'>
                  {formatTime(timestamp)}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Text bubble */}
        {message && (
          <div
            className='
              relative px-4 py-2.5
              bg-white
              text-gray-800 text-sm leading-relaxed
              rounded-2xl rounded-bl-none
              shadow-md shadow-gray-100
              border border-gray-100
              break-words
            '
          >
            {/* Tail */}
            <span
              className='absolute -bottom-0 -left-1.5 w-3 h-3 bg-white border-l border-b border-gray-100'
              style={{
                clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
                borderBottomLeftRadius: '2px',
              }}
            />

            <p className='pr-12'>{message}</p>

            {/* Timestamp inside bubble */}
            <div className='absolute bottom-1.5 right-3 opacity-50'>
              <span className='text-[10px] text-gray-500'>
                {formatTime(timestamp)}
              </span>
            </div>
          </div>
        )}

        {/* Timestamp below image (when there IS text too) */}
        {image && message && (
          <div className='mt-0.5 ml-1 opacity-50'>
            <span className='text-[10px] text-gray-500'>
              {formatTime(timestamp)}
            </span>
          </div>
        )}

        {/* Timestamp when image-only and it loaded with error */}
        {imgError && (
          <div className='mt-0.5 ml-1 opacity-50'>
            <span className='text-[10px] text-gray-500'>
              {formatTime(timestamp)}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReceiverMessage
