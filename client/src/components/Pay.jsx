import React, { useState } from 'react'
import axios from 'axios'
import { useAppStore } from '@/store';
import { useNavigate } from 'react-router-dom';

const Pay = () => {
  const {userInfo} = useAppStore()
  const [amount,setAmount] = useState('')
  const [responseId, setResponseId] = useState("")
  const [responseState, setResponseState] = useState([])
  const navigate = useNavigate()

    const handleManualNavigation = () => {
      navigate("/chat");
    };

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script")
      script.src = src
      script.onload = () => {
        resolve(true)
      }
      script.onerror = () => {
        resolve(false)
      }

      document.body.appendChild(script)
    })
  }

  const createRazorpayOrder = (amount) => {
    let data = JSON.stringify({
      amount: amount*100,
      currency: "INR",
    })

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://greatfulchatapp.onrender.com/api/payments/orders",
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    }

    axios.request(config).then((response) => {
      console.log(JSON.stringify(response.data))
      handleRazorpayScreen(response.data.amount)
    }).catch((error) => {
      console.log("error at", error)
    })
  }

  const handleRazorpayScreen = async(amount) => {
    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js")
    if(!res) {
      alert("Some error at razorpay screen loading")
      return
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: amount,
      currency: 'INR',
      name: "Grateful Chat Application",
      description: "Thank you for Paying",
      image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI3OCIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDc4IDMyIiBmaWxsPSJub25lIj48cGF0aCBkPSJNNTUuNSAwSDc3LjVMNTguNSAzMkgzNi41TDU1LjUgMFoiIGZpbGw9IiM4MzM4ZWMiPjwvcGF0aD48cGF0aCBkPSJNMzUuNSAwSDUxLjVMMzIuNSAzMkgxNi41TDM1LjUgMFoiIGZpbGw9IiM5NzVhZWQiPjwvcGF0aD48cGF0aCBkPSJNMTkuNSAwSDMxLjVMMTIuNSAzMkgwLjVMMTkuNSAwWiIgZmlsbD0iI2ExNmVlOCI+PC9wYXRoPjwvc3ZnPg==',
      handler: function (response) {
      setResponseId(response.razorpay_payment_id);
      axios.post('https://greatfulchatapp.onrender.com/api/payments/success', {
        paymentId: response.razorpay_payment_id,
        email: userInfo.email,
        amount: amount,
        name: `${userInfo.firstName} ${userInfo.lastName}`,
      })
      .then((res) => {
        console.log(res.data)
      })
      .catch((error) => console.log("Error sending payment success email:", error));
      },
      prefill: {
        email: "manav@test.com"
      },
      theme: {
        color: "#8338ec"
      }
    }

    const paymentObject = new window.Razorpay(options)
    paymentObject.open()
  }

  // const paymentFetch = (e) => {
  //   e.preventDefault()
  //   const paymentId = e.target.paymentId.value
  //   axios.get(`http://localhost:5000/api/payments/payment/${paymentId}`).then((response) => {
  //     console.log(response.data)
  //     setResponseState(response.data)
  //   }).catch((error) => {
  //     console.log("Error occurred", error)
  //   })
  // }

  
  
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-purple-700">
      <form onSubmit={(e) => {e.preventDefault(); createRazorpayOrder(amount);}} className="bg-white p-6 rounded shadow-md flex flex-col items-center">
        <div className="mb-4">
          <label className="block text-center text-richblack-900 text-sm font-bold mb-2">
            Enter Amount
          </label>
          <input
            value={amount}
            onChange={e => setAmount(e.target.value)}
            type="text"
            required
            placeholder="Enter Amount"
            className="w-full px-3 py-2 border text-center rounded-md focus:outline-2 focus:outline-purple-50"
          />
        </div>
        <button className="w-full bg-purple-300 py-[12px] px-[12px] rounded-[8px] mt-6 font-medium text-richblack-900"> Pay </button>
        <button onClick={handleManualNavigation} className="w-full bg-purple-300 py-[12px] px-[12px] rounded-[8px] mt-6 font-medium text-richblack-900">
        Go to Chat
      </button>
      </form>
      {/* {responseId && <p> {responseId} </p>}
        <h1> This is payment verification form </h1>
        <form onSubmit={paymentFetch}>
          <input type="text" name="paymentId" placeholder="Enter Payment ID" className="w-full px-3 py-2 border text-center rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <button type="submit"> Fetch Payment </button>
          {responseState.length !== 0 && (
            <ul>
              <li> Amount: Rs. {responseState.amount / 100} </li>
              <li> Currency: {responseState.currency} </li>
              <li> Status: {responseState.status} </li>
              <li> Method: {responseState.method} </li>
            </ul>
          )}
        </form> */}
    </div>
  )
}

export default Pay