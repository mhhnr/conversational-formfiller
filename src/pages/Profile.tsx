import { useState, useEffect, useRef } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import './Profile.scss';
import OpenAI from 'openai';

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OPENAI_API_KEY: string
  // Add other env variables here if needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  id: string;
}

interface ChatHistory {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
}

// Use environment variable - React style
const API_KEY = process.env.REACT_APP_OPENAI_API_KEY as string;
if (typeof API_KEY !== "string") {
  throw new Error("set REACT_APP_OPENAI_API_KEY in .env");
}

export const Profile = () => {
  const { user, isLoading } = useAuth0();
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([
    {
      id: 'chat-1',
      title: 'Looking for jeans recommendations...',
      createdAt: new Date('2024-03-15T10:30:00'),
      messages: [
        {
          role: 'assistant',
          content: 'Hello! I\'m your shopping assistant. How can I help you today?',
          timestamp: new Date('2024-03-15T10:30:00'),
          id: 'initial-1'
        },
        {
          role: 'user',
          content: 'I\'m looking for some comfortable jeans for everyday wear',
          timestamp: new Date('2024-03-15T10:31:00'),
          id: 'user-1'
        },
        {
          role: 'assistant',
          content: 'I\'d recommend our Mid Rise Baby Boot Jeans! They\'re very popular for everyday wear and currently 50% off. Would you like to see them?',
          timestamp: new Date('2024-03-15T10:31:30'),
          id: 'assistant-1'
        },
        {
          role: 'user',
          content: 'Yes, that sounds perfect!',
          timestamp: new Date('2024-03-15T10:32:00'),
          id: 'user-2'
        },
        {
          role: 'assistant',
          content: 'Great choice! I\'ve added them to your cart in size 29 Tall. Would you like to see some personalized recommendations to go with them?',
          timestamp: new Date('2024-03-15T10:32:30'),
          id: 'assistant-2'
        }
      ]
    },
    {
      id: 'chat-2',
      title: 'Help with shipping options...',
      createdAt: new Date('2024-03-14T15:20:00'),
      messages: [
        {
          role: 'assistant',
          content: 'Hello! I\'m your shopping assistant. How can I help you today?',
          timestamp: new Date('2024-03-14T15:20:00'),
          id: 'initial-2'
        },
        {
          role: 'user',
          content: 'What are the shipping options for my order?',
          timestamp: new Date('2024-03-14T15:21:00'),
          id: 'user-3'
        },
        {
          role: 'assistant',
          content: 'We offer free fast shipping on orders over $50 for Rewards Members! Standard delivery takes 3-5 days, and express shipping is available for 1-2 day delivery. Would you like to become a Rewards Member to get free shipping?',
          timestamp: new Date('2024-03-14T15:21:30'),
          id: 'assistant-3'
        },
        {
          role: 'user',
          content: 'Yes, how do I join the rewards program?',
          timestamp: new Date('2024-03-14T15:22:00'),
          id: 'user-4'
        },
        {
          role: 'assistant',
          content: 'I\'ll help you sign up right away! You\'ll get immediate access to free shipping, exclusive discounts, and personalized recommendations.',
          timestamp: new Date('2024-03-14T15:22:30'),
          id: 'assistant-4'
        }
      ]
    },
    {
      id: 'chat-3',
      title: 'Looking for a new tote bag...',
      createdAt: new Date('2024-03-13T09:15:00'),
      messages: [
        {
          role: 'assistant',
          content: 'Hello! I\'m your shopping assistant. How can I help you today?',
          timestamp: new Date('2024-03-13T09:15:00'),
          id: 'initial-3'
        },
        {
          role: 'user',
          content: 'Do you have any good tote bags for everyday use?',
          timestamp: new Date('2024-03-13T09:16:00'),
          id: 'user-5'
        },
        {
          role: 'assistant',
          content: 'Yes! Our Gap Logo Tote is perfect for everyday use. It\'s spacious, durable, and comes in classic colors. Would you like to see it?',
          timestamp: new Date('2024-03-13T09:16:30'),
          id: 'assistant-5'
        },
        {
          role: 'user',
          content: 'What are the dimensions of the tote?',
          timestamp: new Date('2024-03-13T09:17:00'),
          id: 'user-6'
        },
        {
          role: 'assistant',
          content: 'The Gap Logo Tote measures 14" x 16" x 6", perfect for carrying essentials like a laptop, water bottle, and more. It also has interior pockets for organization. Would you like to see it in different colors?',
          timestamp: new Date('2024-03-13T09:17:30'),
          id: 'assistant-6'
        }
      ]
    },
    {
      id: 'chat-4',
      title: 'Looking for running shoes...',
      createdAt: new Date('2024-03-12T14:25:00'),
      messages: [
        {
          role: 'assistant',
          content: 'Hello! I\'m your shopping assistant. How can I help you today?',
          timestamp: new Date('2024-03-12T14:25:00'),
          id: 'initial-4'
        },
        {
          role: 'user',
          content: 'I need new running shoes for marathon training. I have high arches and usually run about 30 miles per week.',
          timestamp: new Date('2024-03-12T14:26:00'),
          id: 'user-7'
        },
        {
          role: 'assistant',
          content: 'Based on your high arches and training intensity, I\'d recommend our Ultra Boost Pro Runner with enhanced arch support. They feature our latest cushioning technology and are designed for long-distance training. They\'re available in sizes 6-14 with wide options. Would you like to know more about their specific features?',
          timestamp: new Date('2024-03-12T14:26:30'),
          id: 'assistant-7'
        },
        {
          role: 'user',
          content: 'Yes, please tell me more about the cushioning and durability.',
          timestamp: new Date('2024-03-12T14:27:00'),
          id: 'user-8'
        },
        {
          role: 'assistant',
          content: 'The Ultra Boost Pro Runner features our responsive CloudFoam technology with a 12mm heel-to-toe drop. The midsole is designed to last 400-500 miles of running. The upper mesh is breathable and water-resistant, while the outsole uses high-durability rubber in high-impact areas. They\'re currently priced at $160, but we have a 20% off promotion for first-time buyers. Would you like to see our color options?',
          timestamp: new Date('2024-03-12T14:27:30'),
          id: 'assistant-8'
        },
        {
          role: 'user',
          content: 'That sounds perfect. What colors do you have in size 10?',
          timestamp: new Date('2024-03-12T14:28:00'),
          id: 'user-9'
        },
        {
          role: 'assistant',
          content: 'In size 10, we currently have: Classic Black/White, Ocean Blue/Silver, Neon Yellow/Gray, and Limited Edition Marathon Red. The Ocean Blue and Marathon Red versions include reflective details for better visibility during early morning or evening runs. Would you like me to add any of these to your cart?',
          timestamp: new Date('2024-03-12T14:28:30'),
          id: 'assistant-9'
        },
        {
          role: 'user',
          content: 'I\'ll take the Ocean Blue/Silver in size 10. Can you also recommend some running socks?',
          timestamp: new Date('2024-03-12T14:29:00'),
          id: 'user-10'
        },
        {
          role: 'assistant',
          content: 'Great choice! I\'ve added the Ocean Blue/Silver Ultra Boost Pro Runner to your cart. For socks, I recommend our Performance Runner Pack - it includes 3 pairs of moisture-wicking, anti-blister socks with arch compression. They\'re perfect for marathon training and currently on sale for $24.99 (usually $35). Would you like me to add these to your cart as well?',
          timestamp: new Date('2024-03-12T14:29:30'),
          id: 'assistant-10'
        }
      ]
    },
    {
      id: 'chat-5',
      title: 'Winter coat recommendations...',
      createdAt: new Date('2024-03-11T11:15:00'),
      messages: [
        {
          role: 'assistant',
          content: 'Hello! I\'m your shopping assistant. How can I help you today?',
          timestamp: new Date('2024-03-11T11:15:00'),
          id: 'initial-5'
        },
        {
          role: 'user',
          content: 'I\'m looking for a warm winter coat that\'s professional enough for work but can also handle weekend activities. I live in Chicago.',
          timestamp: new Date('2024-03-11T11:16:00'),
          id: 'user-11'
        },
        {
          role: 'assistant',
          content: 'For Chicago winters, I\'d recommend our Executive Down Parka. It\'s rated for temperatures down to -20°F and features a clean, professional silhouette. It has a removable hood and hidden interior pockets for your phone and wallet. Would you like to know more about its features?',
          timestamp: new Date('2024-03-11T11:16:30'),
          id: 'assistant-11'
        },
        {
          role: 'user',
          content: 'Yes, what kind of insulation does it use? And is it waterproof?',
          timestamp: new Date('2024-03-11T11:17:00'),
          id: 'user-12'
        },
        {
          role: 'assistant',
          content: 'The Executive Down Parka uses 800-fill ethically sourced goose down with our proprietary WarmLock technology to prevent cold spots. The outer shell is fully waterproof with sealed seams and a DWR finish. It also features underarm vents for temperature regulation during your commute. The coat comes in Regular and Tall lengths. What\'s your usual jacket size?',
          timestamp: new Date('2024-03-11T11:17:30'),
          id: 'assistant-12'
        },
        {
          role: 'user',
          content: 'I usually wear a medium in coats. Do these run true to size? And what colors are available?',
          timestamp: new Date('2024-03-11T11:18:00'),
          id: 'user-13'
        },
        {
          role: 'assistant',
          content: 'The Executive Down Parka runs slightly large to accommodate business attire underneath. For a medium, I\'d recommend trying a small if you prefer a closer fit. Available colors in small are Charcoal Gray, Midnight Navy, and Forest Green. Each color features subtle herringbone detailing and brushed metal hardware. The Charcoal Gray is our most popular choice for professional settings. Would you like to see how it looks on our models?',
          timestamp: new Date('2024-03-11T11:18:30'),
          id: 'assistant-13'
        },
        {
          role: 'user',
          content: 'Yes, please show me the Charcoal Gray in small. Also, what\'s the price and do you offer any warranty?',
          timestamp: new Date('2024-03-11T11:19:00'),
          id: 'user-14'
        },
        {
          role: 'assistant',
          content: 'The Executive Down Parka is priced at $495, and we\'re currently offering a 10% discount for our winter clearance. It comes with a lifetime warranty against manufacturing defects, and we offer free repairs for the first two years. The coat also includes our 60-day wear-and-return guarantee. I\'ve pulled up photos of the Charcoal Gray in small - you can see how it hits just above the knee and features a tailored waist for a professional silhouette. Would you like me to add this to your cart?',
          timestamp: new Date('2024-03-11T11:19:30'),
          id: 'assistant-14'
        }
      ]
    },
    {
      id: 'chat-6',
      title: 'Trending GAP jeans styles...',
      createdAt: new Date('2024-03-10T13:45:00'),
      messages: [
        {
          role: 'assistant',
          content: 'Hello! I\'m your shopping assistant. How can I help you today?',
          timestamp: new Date('2024-03-10T13:45:00'),
          id: 'initial-6'
        },
        {
          role: 'user',
          content: 'What are the most popular jeans styles at GAP right now? I want something trendy but comfortable.',
          timestamp: new Date('2024-03-10T13:46:00'),
          id: 'user-15'
        },
        {
          role: 'assistant',
          content: "Our top trending styles right now are the '90s Loose Fit Jeans and the High Rise Vintage Slim. The '90s Loose is perfect for that relaxed, vintage-inspired look, while the Vintage Slim offers a more tailored silhouette. Both are made with our premium stretch denim for all-day comfort. Would you like details on specific features?",
          timestamp: new Date('2024-03-10T13:46:30'),
          id: 'assistant-15'
        },
        {
          role: 'user',
          content: "Tell me more about the '90s Loose Fit. What washes are available and how do they fit?'",
          timestamp: new Date('2024-03-10T13:47:00'),
          id: 'user-16'
        },
        {
          role: 'assistant',
          content: "The '90s Loose Fit comes in 6 washes: Medium Destroy, Light Destroy with Rips, Dark Clean, Vintage Light, Sky Blue, and Black. They sit at the high waist and feature a relaxed fit through the hip and thigh with a slight taper at the ankle. The most popular wash is Medium Destroy, which has subtle distressing and a lived-in look. They\'re currently part of our denim event at 40% off, making them $53.99 (originally $89.95). Would you like to see how they look on different body types?'",
          timestamp: new Date('2024-03-10T13:47:30'),
          id: 'assistant-16'
        },
        {
          role: 'user',
          content: 'Yes, please show me. Also, do they stretch out with wear? I\'m between sizes.',
          timestamp: new Date('2024-03-10T13:48:00'),
          id: 'user-17'
        },
        {
          role: 'assistant',
          content: "The '90s Loose Fit is made with our premium stretch denim that holds its shape throughout the day. They will give about a half-size with wear, so I recommend sizing down if you\'re between sizes. They\'re available in sizes 24-35 and come in three lengths: Short (27), Regular (29), and Long (31). Our models are wearing sizes 27 and 31 to show the fit on different body types. The relaxed fit is especially flattering on all shapes. Would you like me to help you find your perfect size?'",
          timestamp: new Date('2024-03-10T13:48:30'),
          id: 'assistant-17'
        },
        {
          role: 'user',
          content: 'I think I\'ll try the Medium Destroy in 27. What tops do you recommend styling with these?',
          timestamp: new Date('2024-03-10T13:49:00'),
          id: 'user-18'
        },
        {
          role: 'assistant',
          content: "'Great choice! For the Medium Destroy '90s Loose, I recommend our new Cropped Baby Tee ($29.95) for a true '90s vibe, or our Boxy Oxford Shirt ($65) for a more polished look. Both are trending right now and work perfectly with the high waist. The Baby Tee comes in 8 colors, and we\'re running a buy-one-get-one 50% off promotion. For a layered look, our Oversized Denim Jacket ($89.95) pairs beautifully with these jeans in a contrasting wash. Would you like to see these styling options?'",
          timestamp: new Date('2024-03-10T13:49:30'),
          id: 'assistant-18'
        },
        {
          role: 'user',
          content: 'The Baby Tee sounds perfect. Can you add the jeans in 27 Medium Destroy and two Baby Tees - one in white and one in black?',
          timestamp: new Date('2024-03-10T13:50:00'),
          id: 'user-19'
        },
        {
          role: 'assistant',
          content: "'I\'ve added the '90s Loose Fit Jeans in size 27 Medium Destroy ($53.99) and two Baby Tees in White and Black ($29.95 for the first, $14.98 for the second with the BOGO promotion). Your total comes to $98.92, and you qualify for free shipping with your GAP Rewards membership! The estimated delivery is 3-5 business days. Would you like to see our trending accessories to complete the look?'",
          timestamp: new Date('2024-03-10T13:50:30'),
          id: 'assistant-19'
        },
        {
          role: 'user',
          content: 'Yes, what accessories would work well with this outfit?',
          timestamp: new Date('2024-03-10T13:51:00'),
          id: 'user-20'
        },
        {
          role: 'assistant',
          content: "'To complete your '90s-inspired look, I recommend our Leather Platform Sneakers in White ($79.95), the Mini Canvas Backpack ($49.95, currently 30% off), and our bestselling Gold-Plated Chain Necklace Set ($34.95). The sneakers add height while keeping the look casual, and the layered necklaces are perfect with the Baby Tee neckline. We also have matching anklets if you want to fully embrace the '90s trend! Would you like me to add any of these to your cart?'",
          timestamp: new Date('2024-03-10T13:51:30'),
          id: 'assistant-20'
        }
      ]
    }
  ]);

  // Set initial currentChatId to the first chat
  const [currentChatId, setCurrentChatId] = useState('chat-1');
  
  // Set initial messages to the first chat's messages
  const [messages, setMessages] = useState<ChatMessage[]>(chatHistories[0].messages);

  // Remove the localStorage effects that might be overwriting the chat histories
  useEffect(() => {
    if (messages.length > 1) {
      const title = messages[1]?.content.slice(0, 30) + '...';
      setChatHistories(prev => {
        const updated = prev.filter(h => h.id !== currentChatId);
        return [{
          id: currentChatId,
          title,
          messages,
          createdAt: new Date()
        }, ...updated];
      });
    }
  }, [messages, currentChatId]);

  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showChatList, setShowChatList] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatHistoryLimit = 50;

  // Add OpenAI client initialization
  const openai = new OpenAI({
    apiKey: API_KEY,
    dangerouslyAllowBrowser: true
  });

  // Scroll to bottom of chat
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      const chatMessages = messagesEndRef.current.parentElement;
      chatMessages?.scrollTo({
        top: chatMessages.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  const generateResponse = async (userInput: string): Promise<string> => {
    try {
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are a helpful and knowledgeable shopping assistant for an e-commerce fashion store. You help customers with product recommendations, sizing, style advice, shipping information, and general shopping queries. Keep responses concise, friendly, and focused on fashion retail. If asked about prices, recommend ranges between $20-$200 for common items. For shipping, mention standard delivery (3-5 days) and express options (1-2 days). Maintain a helpful, professional tone."
          },
          {
            role: "user",
            content: userInput
          }
        ],
        model: "gpt-3.5-turbo",
      });

      return completion.choices[0]?.message?.content || "I apologize, but I couldn't process your request at the moment.";
    } catch (error) {
      console.error('Error generating response:', error);
      return "I apologize, but I'm having trouble connecting right now. Please try again later.";
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
      id: `user-${Date.now()}`
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Wait for DOM update before scrolling
    setTimeout(scrollToBottom, 100);

    try {
      const response = await generateResponse(inputMessage);
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        id: `assistant-${Date.now()}`
      };
      setMessages(prev => [...prev, assistantMessage]);
      setTimeout(scrollToBottom, 100);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChatHistory = () => {
    const confirmClear = window.confirm('Are you sure you want to clear chat history?');
    if (confirmClear) {
      setMessages([{
        role: 'assistant',
        content: 'Hello! I\'m your shopping assistant. How can I help you today?',
        timestamp: new Date(),
        id: 'initial'
      }]);
    }
  };

  const startNewChat = () => {
    const newChatId = `chat-${Date.now()}`;
    setCurrentChatId(newChatId);
    setMessages([{
      role: 'assistant',
      content: 'Hello Venu! I\'m your shopping assistant. How can I help you today?',
      timestamp: new Date(),
      id: 'initial'
    }]);
  };

  const loadChat = (chatId: string) => {
    const chat = chatHistories.find(h => h.id === chatId);
    if (chat) {
      setCurrentChatId(chatId);
      setMessages(chat.messages);
    }
    setShowChatList(false);
  };

  const deleteChat = (chatId: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this chat?');
    if (confirmDelete) {
      setChatHistories(prev => prev.filter(h => h.id !== chatId));
      if (currentChatId === chatId) {
        startNewChat();
      }
    }
  };

  // Add debug logging
  useEffect(() => {
    console.log('Chat Histories:', chatHistories);
    console.log('Show Chat List:', showChatList);
    console.log('Current Chat ID:', currentChatId);
  }, [chatHistories, showChatList, currentChatId]);

  // Modify the button click handler
  const toggleChatList = () => {
    console.log('Toggle Chat List clicked');
    console.log('Current showChatList value:', showChatList);
    setShowChatList(!showChatList);
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-section">
          <h1>My Profile</h1>
          {user && (
            <div className="profile-info">
              {user.picture && (
                <img src={user.picture} alt={user.name || 'Profile'} className="profile-image" />
              )}
              <div className="profile-details">
                <h2>{user.name}</h2>
                <p>{user.email}</p>
                <div className="profile-stats">
                  <div className="stat">
                    <span className="stat-value">12</span>
                    <span className="stat-label">Orders</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">5</span>
                    <span className="stat-label">Reviews</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">3</span>
                    <span className="stat-label">Wishlists</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="chatbot-section">
          <div className="chat-header">
            <div className="chat-controls">
              <button 
                onClick={toggleChatList}
                className={`chat-list-btn ${showChatList ? 'active' : ''}`}
              >
                ☰
              </button>
              <h2>Venu's Shopping Assistant</h2>
            </div>
            <div className="chat-actions">
              <button onClick={startNewChat} className="new-chat">
                New Chat
              </button>
            </div>
          </div>

          <div className="chat-container">
            <div className={`chat-sidebar ${showChatList ? 'visible' : ''}`}>
              <div className="sidebar-header">
                <h3>Chat History ({chatHistories.length})</h3>
              </div>
              <div className="chat-history-list">
                {chatHistories.map((chat) => (
                  <div 
                    key={chat.id} 
                    className={`chat-history-item ${currentChatId === chat.id ? 'active' : ''}`}
                    onClick={() => loadChat(chat.id)}
                  >
                    <div className="chat-title">
                      {chat.title}
                    </div>
                    <div className="chat-meta">
                      <span className="chat-date">
                        {new Date(chat.createdAt).toLocaleDateString()}
                      </span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteChat(chat.id);
                        }} 
                        className="delete-chat"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className={`chat-main ${showChatList ? 'shifted' : ''}`}>
              <div className="chat-messages">
                {messages.map((message) => (
                  <div key={message.id} className={`message ${message.role}`}>
                    <div className="message-content">
                      {message.content}
                    </div>
                    <div className="message-timestamp">
                      {new Date(message.timestamp).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="typing-indicator">
                    Assistant is typing...
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSendMessage} className="chat-input">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask about products, sizes, or style advice..."
                />
                <button type="submit">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M22 2L11 13" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22 2L15 22L11 13L2 9L22 2Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 