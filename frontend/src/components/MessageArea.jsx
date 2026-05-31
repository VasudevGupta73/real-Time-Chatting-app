import React, { useState, useRef, useEffect } from 'react'
import 'emoji-picker-element'
import { useSelector, useDispatch } from 'react-redux'
import { clearSelectedUser } from '../../redux/userSlice'
import { setMessages, setMessages as setReduxMessages } from '../../redux/messageSlice'
import SenderMessage from './SenderMessage'
import ReceiverMessage from './ReceiverMessage'
import axios from 'axios'
import toast from 'react-hot-toast'
import { serverUrl } from '../main'
import useGetMessage from '../customHookes/getMessage'

const MessageArea = ({ probes }) => {
  const dispatch = useDispatch()
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const fileInputRef = useRef(null)
  const messagesEndRef = useRef(null)
  const emojiPickerRef = useRef(null)
  const emojiButtonRef = useRef(null)
  const {selectedUser,userData,socket,onlineUser} = useSelector(state => state.user)
  const authUser = useSelector(state => state.user?.userData)
  const reduxMessages = useSelector(state => state.message?.messages)


  // Fetch messages whenever selected user changes
  useGetMessage()

  // Auto scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [reduxMessages])

  useEffect(() => {

  }, [selectedUser]);
  useEffect(()=>{
    if(!socket) return;
    socket.on("newMessage",(message)=>{
      dispatch(setMessages([...reduxMessages,message]));
    })
    return () => socket.off("newMessage");
  },[socket,reduxMessages])

  // Wire up emoji-picker-element web component event & close on outside click
  useEffect(() => {
    const pickerEl = emojiPickerRef.current
    if (!pickerEl) return

    const handleEmojiClick = (e) => {
      setInputValue(prev => prev + e.detail.unicode);
      
    }
    pickerEl.addEventListener('emoji-click', handleEmojiClick)
    return () => pickerEl.removeEventListener('emoji-click', handleEmojiClick)
  }, [showEmojiPicker])

  useEffect(() => {
    if (!showEmojiPicker) return
    const handleOutsideClick = (e) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(e.target) &&
        !emojiButtonRef.current.contains(e.target)
      ) {
        setShowEmojiPicker(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [showEmojiPicker])

  const handleSendMessage = async (e) => {
    e.preventDefault()

    if (!inputValue.trim() && !imageFile) return

    // Capture values before clearing state
    const messageText = inputValue
    const attachedFile = imageFile

    setInputValue('')
    setImageFile(null)
    setImagePreview(null)
    setIsLoading(true)

    // Send to backend
    try {
      const formData = new FormData()
      formData.append('message', messageText)
      if (attachedFile) { 
        formData.append('image', attachedFile)
      }
      const result = await axios.post(
        `${serverUrl}/message/send/${selectedUser?._id}`,
        formData,
        { withCredentials: true }
      )
      if (result.data?.newMessage) {
        // Append the new message from server to redux
        dispatch(setReduxMessages([...(reduxMessages || []), result.data.newMessage]))
      }
    } catch (error) {
      toast.error('Failed to send message')

    } finally {
      setIsLoading(false)
    }
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    const today = new Date()
    const yesterday = new Date(today.setDate(today.getDate() - 1))

    if (date.toDateString() === new Date().toDateString()) {
      return 'Today'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
  }

  // Welcome screen when no user is selected
  if (!selectedUser) {
    return (
      <div className='lg:w-[70%] w-full h-full bg-gradient-to-br from-gray-50 via-white to-blue-50 border-l border-gray-200 flex flex-col items-center justify-center relative overflow-hidden'>
        {/* Decorative background circles */}
        <div className='absolute top-[-80px] right-[-80px] w-[250px] h-[250px] rounded-full bg-gradient-to-br from-blue-100/40 to-cyan-100/40 blur-2xl' />
        <div className='absolute bottom-[-60px] left-[-60px] w-[200px] h-[200px] rounded-full bg-gradient-to-br from-indigo-100/30 to-purple-100/30 blur-2xl' />

        <div className='relative z-10 flex flex-col items-center text-center px-6'>
          {/* Icon */}
          <div className='w-[90px] h-[90px] rounded-3xl bg-gradient-to-br from-[#00c6ff] to-[#0072ff] flex items-center justify-center shadow-xl shadow-blue-500/20 mb-6'>
            <svg className='w-11 h-11 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' />
            </svg>
          </div>

          <h2 className='text-2xl font-bold text-gray-800 mb-2'>
            Welcome to <span className='bg-gradient-to-r from-[#00c6ff] to-[#0072ff] bg-clip-text text-transparent'>Chatters</span>
          </h2>
          <p className='text-gray-500 text-[15px] max-w-xs leading-relaxed'>
            Select a conversation from the sidebar or search for a friend to start chatting.
          </p>

          {/* Subtle animated dots */}
          <div className='flex gap-1.5 mt-8'>
            <span className='w-2 h-2 rounded-full bg-blue-400 animate-bounce' style={{ animationDelay: '0ms' }} />
            <span className='w-2 h-2 rounded-full bg-cyan-400 animate-bounce' style={{ animationDelay: '150ms' }} />
            <span className='w-2 h-2 rounded-full bg-blue-500 animate-bounce' style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='lg:w-[70%] w-full h-full bg-white border-l border-gray-200 flex flex-col relative'>

      {/* Header */}
      <div className='flex items-center justify-between p-4 border-b border-gray-200 bg-white shadow-sm'>
        <div className='flex items-center gap-3'>
          <button
            type='button'
            className='lg:hidden text-blue-600 font-semibold px-2 py-1 rounded-md hover:bg-blue-50 transition'
            onClick={() => dispatch(clearSelectedUser())}
          >
            Back
          </button>
          {selectedUser?.image ? (
            <img
              src={selectedUser.image}
              alt={selectedUser?.name}
              className='w-10 h-10 rounded-full object-cover'
            />
          ) : (
            <div className='w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold'>
              {selectedUser?.name?.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h3 className='font-semibold text-gray-800'>{selectedUser?.name || 'Chat'}</h3>
            <p className='text-xs text-gray-500'>
              {onlineUser?.includes(selectedUser?._id) ? (
                <span className='flex items-center gap-1'>
                  <span className='w-2 h-2 bg-green-500 rounded-full'></span>
                  Online
                </span>
              ) : (
                <span className='flex items-center gap-1'>
                  <span className='w-2 h-2 bg-gray-400 rounded-full'></span>
                  Offline
                </span>
              )}
            </p>
          </div>
        </div>

        <div className='flex gap-2'>
          <button className='p-2 hover:bg-gray-100 rounded-full transition'>
            <svg className='w-5 h-5 text-gray-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' />
            </svg>
          </button>
          <button className='p-2 hover:bg-gray-100 rounded-full transition'>
            <svg className='w-5 h-5 text-gray-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages Container */}
      <div className='flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white space-y-4'>
        {(!reduxMessages || reduxMessages.length === 0) ? (
          <div className='flex flex-col items-center justify-center h-full text-gray-400'>
            <svg className='w-16 h-16 mb-3 opacity-30' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' />
            </svg>
            <p>No messages yet</p>
            <p className='text-sm'>Start a conversation with {selectedUser?.name}</p>
          </div>
        ) : (
          reduxMessages.map((msg, index) => {
            const isOwn = msg.sender === authUser?._id ||
                          msg.sender?._id === authUser?._id
            return (
              <div key={msg._id || index}>
                {/* Date separator */}
                {(index === 0 || formatDate(reduxMessages[index - 1].createdAt) !== formatDate(msg.createdAt)) && (
                  <div className='flex items-center gap-2 my-4'>
                    <div className='flex-1 h-px bg-gray-200'></div>
                    <span className='text-xs text-gray-400 px-2 bg-white rounded-full border border-gray-200 py-0.5'>
                      {formatDate(msg.createdAt)}
                    </span>
                    <div className='flex-1 h-px bg-gray-200'></div>
                  </div>
                )}

                {isOwn ? (
                  <SenderMessage
                    message={msg.message}
                    image={msg.image}
                    timestamp={msg.createdAt}
                    status='sent'
                  />
                ) : (
                  <ReceiverMessage
                    message={msg.message}
                    image={msg.image}
                    timestamp={msg.createdAt}
                    senderName={selectedUser?.name}
                    senderAvatar={selectedUser?.avatar || selectedUser?.image}
                  />
                )}
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className='p-4 border-t border-gray-200 bg-white'>
        {/* Emoji Picker Popup */}
        {showEmojiPicker && (
          <div className='absolute bottom-20 right-4 z-50 shadow-2xl rounded-xl overflow-hidden'>
            <emoji-picker ref={emojiPickerRef} />
          </div>
        )}

        <form onSubmit={handleSendMessage} className='flex gap-3 relative'>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type='file'
            accept='image/*,video/*'
            className='hidden'
            onChange={(e) => {
              const file = e.target.files[0]
              if (!file) return
              setImageFile(file)
              setImagePreview(URL.createObjectURL(file))
            }}
          />

          {/* Attachment button — triggers the hidden input */}
          <label
            htmlFor='file-upload'
            onClick={() => fileInputRef.current?.click()}
            className={`flex-shrink-0 p-2 rounded-full transition cursor-pointer ${
              imageFile ? 'text-blue-600 bg-blue-100' : 'text-gray-600 hover:bg-gray-100'
            }`}
            title='Attach image or video'
          >
            {imageFile ? (
              // Show thumbnail preview badge
              <div className='relative'>
                <img
                  src={imagePreview}
                  alt='preview'
                  className='w-6 h-6 rounded object-cover ring-2 ring-blue-400'
                />
                <button
                  type='button'
                  onClick={(e) => { e.stopPropagation(); setImageFile(null); setImagePreview(null) }}
                  className='absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-red-500 text-white rounded-full flex items-center justify-center text-[8px] leading-none'
                >
                  ✕
                </button>
              </div>
            ) : (
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13' />
              </svg>
            )}
          </label>

          <input
            type='text'
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder='Type a message...'
            className='flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-gray-50'
          />

          {/* Emoji Toggle Button */}
          <button
            type='button'
            ref={emojiButtonRef}
            onClick={() => setShowEmojiPicker(prev => !prev)}
            className={`flex-shrink-0 p-2 rounded-full transition ${showEmojiPicker
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-600 hover:bg-gray-100'
              }`}
            title='Pick an emoji'
          >
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
            </svg>
          </button>

          <button
            type='submit'
            disabled={(!inputValue.trim() && !imageFile) || isLoading}
            className='flex-shrink-0 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-medium'
          >
            {isLoading ? (
              <span className='flex items-center gap-2'>
                <span className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></span>
              </span>
            ) : (
              <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                <path d='M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.41,22.99 3.50612381,23.1 4.13399899,22.9429026 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.9702544,11.6889879 L4.13399899,1.16346272 C3.34915502,0.9 2.40734225,1.00636533 1.77946707,1.4776575 C0.994623095,2.10604706 0.837654326,3.0486314 1.15159189,3.99701575 L3.03521743,10.4380088 C3.03521743,10.5951061 3.34915502,10.7522035 3.50612381,10.7522035 L16.6915026,11.5376904 C16.6915026,11.5376904 17.1624089,11.5376904 17.1624089,12.0089826 C17.1624089,12.4744748 16.6915026,12.4744748 16.6915026,12.4744748 Z' />
              </svg>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default MessageArea;