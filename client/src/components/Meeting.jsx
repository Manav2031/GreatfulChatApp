import React, {useState} from 'react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

const Meeting = () => {
  const [roomCode,setRoomCode] = useState('')
  const navigate = useNavigate()

  const handleFormSubmit = (ev) => {
    ev.preventDefault()
    navigate(`/room/${roomCode}`)
  }
  
  return (
    <div className="flex items-center justify-center h-screen bg-purple-700">
      <form onSubmit={handleFormSubmit} className="bg-white p-6 rounded shadow-md flex flex-col items-center">
        <div className="mb-4">
          <label className="block text-center text-richblack-900 text-sm font-bold mb-2">
            Enter Room Code
          </label>
          <input
            value={roomCode}
            onChange={e => setRoomCode(e.target.value)}
            type="text"
            required
            placeholder="Enter Room Code"
            className="w-full px-3 py-2 border text-center rounded-md focus:outline-2 focus:outline-purple-50"
          />
        </div>
        <Button className="w-full bg-purple-300 py-[12px] px-[12px] rounded-[8px] mt-6 font-medium text-richblack-900"> Enter Room </Button>
      </form>
    </div>
  );
};

export default Meeting;
