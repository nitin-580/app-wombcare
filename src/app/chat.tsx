import {
    SafeAreaView,
  } from "react-native-safe-area-context";
  
  export default function WombCareChatUI() {
  
    const messages = [
  
      {
        id: 1,
        role: "ai",
  
        text:
          "Hi Nitin 🌸 I can help you understand PCOS, periods, yoga, nutrition, and wellness routines.",
      },
  
      {
        id: 2,
        role: "user",
  
        text:
          "Can yoga help regulate irregular periods?",
      },
  
      {
        id: 3,
        role: "ai",
  
        text:
          "Yes 💕 Certain yoga practices may help reduce stress and support hormonal balance when combined with proper sleep, nutrition, and exercise.",
      },
    ];
  
    return (
  
      <SafeAreaView className="flex-1 bg-[#FFF7FB]">
  
        <div className="h-full flex flex-col">
  
          {/* Header */}
  
          <div className="px-5 pt-2 pb-4 bg-white border-b border-pink-100 shadow-sm">
  
            <div className="flex items-center justify-between">
  
              <div>
  
                <h1 className="text-2xl font-bold text-gray-900">
                  WombCare AI
                </h1>
  
                <p className="text-sm text-pink-500 mt-1">
                  Your wellness companion
                </p>
  
              </div>
  
              <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center text-xl">
                🌸
              </div>
  
            </div>
  
          </div>
  
          {/* Suggested prompts */}
  
          <div className="px-4 py-3 flex gap-2 overflow-x-auto bg-white border-b border-pink-50">
  
            {[
              "PCOS tips",
              "Yoga for cramps",
              "Foods to avoid",
              "Irregular periods",
            ].map((item) => (
  
              <button
  
                key={item}
  
                className="px-4 py-2 rounded-full bg-pink-50 text-pink-600 text-sm whitespace-nowrap"
              >
  
                {item}
  
              </button>
            ))}
  
          </div>
  
          {/* Chat Area */}
  
          <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
  
            {messages.map((message) => (
  
              <div
  
                key={message.id}
  
                className={`flex ${
                  message.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
  
                <div
  
                  className={`max-w-[80%] px-4 py-3 rounded-3xl shadow-sm ${
                    message.role === "user"
                      ? "bg-pink-500 text-white rounded-br-md"
                      : "bg-white text-gray-800 rounded-bl-md"
                  }`}
                >
  
                  <p className="text-[15px] leading-6">
                    {message.text}
                  </p>
  
                </div>
  
              </div>
            ))}
  
            {/* Typing Indicator */}
  
            <div className="flex justify-start">
  
              <div className="bg-white px-4 py-3 rounded-3xl rounded-bl-md shadow-sm flex items-center gap-1">
  
                <div className="w-2 h-2 rounded-full bg-pink-300 animate-bounce" />
  
                <div className="w-2 h-2 rounded-full bg-pink-300 animate-bounce delay-100" />
  
                <div className="w-2 h-2 rounded-full bg-pink-300 animate-bounce delay-200" />
  
              </div>
  
            </div>
  
          </div>
  
          {/* Input Area */}
  
          <div className="bg-white border-t border-pink-100 px-4 py-4">
  
            <div className="flex items-center gap-3">
  
              <button className="w-12 h-12 rounded-full bg-pink-50 flex items-center justify-center text-xl">
                🎤
              </button>
  
              <div className="flex-1 bg-[#FFF4F8] rounded-full px-4 py-3 flex items-center">
  
                <input
  
                  placeholder="Ask anything about wellness..."
  
                  className="bg-transparent outline-none flex-1 text-[15px]"
                />
  
              </div>
  
              <button className="w-12 h-12 rounded-full bg-pink-500 text-white text-lg shadow-md">
                ➤
              </button>
  
            </div>
  
          </div>
  
        </div>
  
      </SafeAreaView>
    );
  }