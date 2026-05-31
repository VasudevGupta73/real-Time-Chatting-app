import React from 'react'
import { useSelector } from 'react-redux'

const Files = () => {
    const { userData } = useSelector((state) => state.user)

    return (
        <div className='w-full h-[100vh] bg-slate-100 p-8'>
            <div className='max-w-7xl mx-auto'>
                <h1 className='text-4xl font-bold text-gray-800 mb-8'>Files</h1>

                {userData && (
                    <div className='bg-white rounded-lg shadow-lg p-6'>
                        <p className='text-gray-600 mb-4'>Welcome, <span className='font-semibold'>{userData.username || userData.email}</span></p>
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                            {/* File list will go here */}
                            <div className='border border-dashed border-gray-300 rounded-lg p-8 text-center'>
                                <p className='text-gray-500'>No files yet</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Files
