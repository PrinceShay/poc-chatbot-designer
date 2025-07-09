import Script from "next/script";

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Chatbot Demo</h1>
        
        <div className="bg-white p-8 rounded-lg shadow-sm mb-8">
          <h2 className="text-xl font-semibold mb-4">Verfügbare Chatbots</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Modern Blue Chatbot</h3>
              <p className="text-sm text-gray-600 mb-3">ID: chatbot-1</p>
              <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                Position: Unten rechts
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Dark Theme Chatbot</h3>
              <p className="text-sm text-gray-600 mb-3">ID: chatbot-2</p>
              <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                Position: Unten links
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Minimalist Chatbot</h3>
              <p className="text-sm text-gray-600 mb-3">ID: chatbot-3</p>
              <div className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                Position: Unten rechts
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Teste die Chatbots</h2>
          <p className="text-gray-600 mb-4">
            Die Chatbots werden automatisch geladen. Klicke auf den Chat-Button in der unteren rechten Ecke.
          </p>
          
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900">Modern Blue Chatbot</h3>
              <p className="text-sm text-blue-700">
                Script: <code className="bg-blue-100 px-2 py-1 rounded text-xs">
                  &lt;script src=&quot;/chatbot.js&quot; data-chatbot-id=&quot;chatbot-1&quot;&gt;&lt;/script&gt;
                </code>
              </p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-900">Dark Theme Chatbot</h3>
              <p className="text-sm text-green-700">
                Script: <code className="bg-green-100 px-2 py-1 rounded text-xs">
                  &lt;script src=&quot;/chatbot.js&quot; data-chatbot-id=&quot;chatbot-2&quot;&gt;&lt;/script&gt;
                </code>
              </p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900">Minimalist Chatbot</h3>
              <p className="text-sm text-gray-700">
                Script: <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                  &lt;script src=&quot;/chatbot.js&quot; data-chatbot-id=&quot;chatbot-3&quot;&gt;&lt;/script&gt;
                </code>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Chatbot Scripts */}
      <Script src="/chatbot.js" data-chatbot-id="chatbot-1" strategy="afterInteractive" />
      <Script src="/chatbot.js" data-chatbot-id="chatbot-2" strategy="afterInteractive" />
      <Script src="/chatbot.js" data-chatbot-id="chatbot-3" strategy="afterInteractive" />
    </div>
  );
} 