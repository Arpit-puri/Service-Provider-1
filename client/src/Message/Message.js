import React, { useContext } from 'react'
import { userContext } from '../App'
import { useNavigate } from 'react-router-dom';
import url from '../url';
import axios from 'axios';

const Message = () => {

  const { state: { onLine, message, user, provider, socket }, dispatch } = useContext(userContext);
  const navigate = useNavigate();

  const create = async () => {
    try {
      const { data } = await axios.post(`${url}/api/client/create`, {
        user: user.id,
        provider: provider._id
      }, {
        method: "POST",
        headers: {
          Authorization: user.token,
          "Content-Type": "application/json"
        }
      });
      dispatch({ type: "create", payload: data._id });
      dispatch({
        type: 'chat', payload: {
          chatId: data._id,
          message: [],
          puser: 0,
          latest: "Say Hi!"
        }
      });

    } catch (error) {
      console.log(error);
    }
  }

  const goChatting = (item) => {
    dispatch({ type: "provider", payload: item.provider })
    let present;
    if (message.length) {
      present = message.some((obj) => {
        if (!obj.provider) {
          return false;
        }
        if (obj.provider._id === item.provider._id) {
          dispatch({ type: 'chat', payload: obj })
          return true;
        }
        return false;
      });
    }
    if (!present) {
      create();
    }
    if (onLine == 1)
      navigate('/chatting')
    else
      navigate('/dashboard/chatting')

  }


  return (
    <div className="h-screen  items-center ">
      <form className="my-5 w-full px-20 ">
        <label for="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only">Search</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
            </svg>
          </div>
          <input type="search" id="default-search" className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-50" placeholder="Search Chat" required/>
            <button type="submit" className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 ">Search</button>
        </div>
      </form>

      {message.length && message.map((item) => {
        return (
          <div onClick={() => {
            goChatting(item);
          }}>
            <div className="border flex flex-col">
              <div className="bg-grey-lighter flex-1 overflow-auto">
                <div className="px-3 flex items-center bg-grey-light cursor-pointer">
                  <div>
                    <img className="h-12 w-12 rounded-full"
                      src="./icons/Default.png" />
                  </div>
                  <div className="ml-4 flex-1 border-b border-grey-lighter py-4">
                    <div className="flex items-bottom justify-between">
                      <p className="text-grey-darkest">
                        <span>{item.provider ? item.provider.fname : <></>} </span>
                        <span>  {item.provider ? item.provider.lname : <></>}</span>
                      </p>
                    </div>
                    <p className="text-grey-dark mt-1 text-sm">
                      {item.latest}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Message;
