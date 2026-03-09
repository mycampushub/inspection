"use client"

import { useEffect, useRef, useState } from "react"
import { aiChatHistory } from "@/lib/local-data"
import { ActivityIcon as Attachment, Bot, Download, Loader2, Mic, MoreHorizontal, Send, User, X } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"

// Types
interface Message {
  role: "user" | "assistant"
  content: string
  thinking?: string
  timestamp: string
  showThinking?: boolean
  id?: string
}

interface SavedResponse {
  id: string
  content: string
  timestamp: string
  title: string
}

interface ConversationHistory {
  id: string
  title: string
  messages: Message[]
  timestamp: string
}

// Convert aiChatHistory to Message format
const initialMessages: Message[] = aiChatHistory.length > 0 ? aiChatHistory[0].messages.map(m => ({
  role: m.role,
  content: m.content,
  timestamp: aiChatHistory[0].createdAt || m.timestamp,
  id: m.id || `${Math.random()}`,
})) : [];

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [inputValue, setInputValue] = useState("")
  const [isThinking, setIsThinking] = useState(false)
  const [showThinking, setShowThinking] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [activeTab, setActiveTab] = useState("chat")
  const [attachedFile, setAttachedFile] = useState<File | null>(null)
  const [savedResponses, setSavedResponses] = useState<SavedResponse[]>([])
  const [conversationHistory, setConversationHistory] = useState<ConversationHistory[]>(aiChatHistory.length > 0 ? aiChatHistory.map(chat => ({
    id: chat.id,
    title: chat.title,
    messages: chat.messages.map(m => ({
      role: m.role,
      content: m.content,
      timestamp: chat.createdAt || m.timestamp,
      id: m.id || `${Math.random()}`,
    })),
    timestamp: chat.createdAt,
  })) : [])
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Load saved data from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('ai-assistant-saved')
    if (saved) {
      try {
        setSavedResponses(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load saved responses:', e)
      }
    }

    // Conversation history is already loaded from aiChatHistory
  }, [])

  // Save current conversation to history periodically
  useEffect(() => {
    if (messages.length > 0) {
      const currentHistory = {
        id: 'current',
        title: messages[0].role === 'user' 
          ? messages[0].content.substring(0, 50) + '...'
          : 'New Conversation',
        messages: messages,
        timestamp: new Date().toISOString(),
      }
      
      // Only save if it's different from the last saved
      const existingIndex = conversationHistory.findIndex(h => h.id === 'current')
      if (existingIndex === -1 || JSON.stringify(conversationHistory[existingIndex].messages) !== JSON.stringify(messages)) {
        const newHistory = existingIndex === -1 
          ? [...conversationHistory, currentHistory]
          : conversationHistory.map(h => h.id === 'current' ? currentHistory : h)
        setConversationHistory(newHistory)
        localStorage.setItem('ai-assistant-history', JSON.stringify(newHistory))
      }
    }
  }, [messages])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isThinking])

  const handleSendMessage = async () => {
    if (!inputValue.trim() && !attachedFile) return

    // Add user message
    const userMessage: Message = {
      role: "user",
      content: inputValue + (attachedFile ? `\n\n[Attached: ${attachedFile.name}]` : ""),
      timestamp: new Date().toISOString(),
      id: Date.now().toString(),
    }
    
    setMessages([...messages, userMessage])
    const currentInput = inputValue
    setInputValue("")
    setAttachedFile(null)

    // Call AI API
    setIsThinking(true)
    setShowThinking(true)
    
    try {
      const response = await fetch('/api/ai-assistant/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()
      
      const assistantMessage: Message = {
        role: "assistant",
        thinking: "Analyzing your request...\n\nRetrieving relevant procurement data...\n\nProcessing information and generating insights...",
        content: data.content,
        timestamp: data.timestamp,
        id: Date.now().toString(),
      }
      
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      
      // Fallback to simulated response on error
      setTimeout(() => {
        const assistantMessage: Message = {
          role: "assistant",
          thinking: "Analyzing your request...\n\nRetrieving relevant procurement data...\n\nProcessing information and generating insights...",
          content: "I apologize, but I'm having trouble connecting to the AI service. Let me help you with a simulated response instead.\n\nBased on your question about \"" + currentInput + "\", I recommend checking your procurement dashboard for the most up-to-date information. Would you like me to help you navigate to a specific section?",
          timestamp: new Date().toISOString(),
          id: Date.now().toString(),
        }
        setMessages((prev) => [...prev, assistantMessage])
      }, 1500)
    } finally {
      setIsThinking(false)
      setShowThinking(false)
    }
  }

  const handleAttachmentClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAttachedFile(file)
    }
  }

  const handleRemoveAttachment = () => {
    setAttachedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSaveResponse = (content: string) => {
    const newSaved: SavedResponse = {
      id: Date.now().toString(),
      content: content,
      timestamp: new Date().toISOString(),
      title: content.substring(0, 50) + (content.length > 50 ? '...' : ''),
    }
    
    const updatedSaved = [...savedResponses, newSaved]
    setSavedResponses(updatedSaved)
    localStorage.setItem('ai-assistant-saved', JSON.stringify(updatedSaved))
  }

  const handleCopyToClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content)
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
    }
  }

  const handleRegenerateResponse = (messageIndex: number) => {
    // Find the last user message before this assistant message
    let lastUserMessageIndex = -1
    for (let i = messageIndex - 1; i >= 0; i--) {
      if (messages[i].role === 'user') {
        lastUserMessageIndex = i
        break
      }
    }

    if (lastUserMessageIndex === -1) {
      console.error('No user message found to regenerate from')
      return
    }

    // Remove all messages from the user message onward
    const newMessages = messages.slice(0, lastUserMessageIndex)
    setMessages(newMessages)
    
    // Resend the user message
    const userMessage = messages[lastUserMessageIndex]
    setInputValue(userMessage.content)
    handleSendMessage()
  }

  const handleDeleteSavedResponse = (id: string) => {
    const updatedSaved = savedResponses.filter(s => s.id !== id)
    setSavedResponses(updatedSaved)
    localStorage.setItem('ai-assistant-saved', JSON.stringify(updatedSaved))
  }

  const handleLoadConversation = (conversationId: string) => {
    const conversation = conversationHistory.find(c => c.id === conversationId)
    if (conversation) {
      setMessages(conversation.messages)
      setSelectedConversationId(conversationId)
      setActiveTab('chat')
    }
  }

  const handleDeleteConversation = (id: string) => {
    const updatedHistory = conversationHistory.filter(c => c.id !== id)
    setConversationHistory(updatedHistory)
    localStorage.setItem('ai-assistant-history', JSON.stringify(updatedHistory))
    
    if (selectedConversationId === id) {
      setSelectedConversationId(null)
      setMessages(initialMessages)
    }
  }

  const handleStartNewConversation = () => {
    setMessages([
      {
        role: "assistant",
        content: "Hello! I'm your procurement AI assistant. How can I help you today?",
        timestamp: new Date().toISOString(),
      }
    ])
    setSelectedConversationId(null)
    setActiveTab('chat')
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    if (!isRecording) {
      setTimeout(() => {
        setIsRecording(false)
        setInputValue("Can you analyze our contract renewal schedule for the next quarter?")
      }, 3000)
    }
  }

  return (
    <SidebarInset>
      <div className="flex h-16 items-center gap-4 border-b bg-background px-4 lg:px-6">
        <SidebarTrigger />
        <div className="flex items-center text-lg font-semibold">AI Assistant</div>
        <div className="ml-auto flex items-center gap-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="saved">Saved</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      {activeTab === 'chat' && (
        <div className="flex flex-col h-[calc(100vh-4rem)]">
          <div className="flex-1 overflow-y-auto p-4">
            <div className="max-w-4xl mx-auto space-y-4">
              {messages.map((message, index) => (
                <div key={message.id || index} className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}>
                  <div
                    className={`flex gap-3 max-w-[80%] ${message.role === "assistant" ? "flex-row" : "flex-row-reverse"}`}
                  >
                    <Avatar className={`h-8 w-8 ${message.role === "user" ? "bg-primary" : "bg-muted"}`}>
                      {message.role === "assistant" ? (
                        <Bot className="h-5 w-5 text-primary" />
                      ) : (
                        <User className="h-5 w-5 text-primary-foreground" />
                      )}
                      <AvatarFallback>{message.role === "assistant" ? "AI" : "You"}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <div
                        className={`rounded-lg p-3 ${
                          message.role === "assistant" ? "bg-muted text-foreground" : "bg-primary text-primary-foreground"
                        }`}
                      >
                        {message.content.split("\n").map((line, i) => (
                          <p key={i} className={i > 0 ? "mt-2" : ""}>
                            {line}
                          </p>
                        ))}
                      </div>
                      {message.thinking && message.role === "assistant" && (
                        <div className="text-xs text-muted-foreground">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs"
                            onClick={() => {
                              const updatedMessages = [...messages]
                              updatedMessages[index] = {
                                ...updatedMessages[index],
                                showThinking: !updatedMessages[index].showThinking,
                              }
                              setMessages(updatedMessages)
                            }}
                          >
                            {message.showThinking ? "Hide thinking" : "Show thinking"}
                          </Button>
                          {message.showThinking && (
                            <Card className="mt-2 bg-muted/50">
                              <CardContent className="p-3">
                                <pre className="text-xs whitespace-pre-wrap font-mono text-muted-foreground">
                                  {message.thinking}
                                </pre>
                              </CardContent>
                            </Card>
                          )}
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground flex items-center gap-2">
                        {formatTime(message.timestamp)}
                        {message.role === "assistant" && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                                <MoreHorizontal className="h-3 w-3" />
                                <span className="sr-only">More options</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                              <DropdownMenuItem onClick={() => handleSaveResponse(message.content)}>
                                <Download className="mr-2 h-4 w-4" />
                                Save response
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleCopyToClipboard(message.content)}>
                                Copy to clipboard
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleRegenerateResponse(index)}>
                                Regenerate response
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {isThinking && (
                <div className="flex justify-start">
                  <div className="flex gap-3 max-w-[80%]">
                    <Avatar className="h-8 w-8 bg-muted">
                      <Bot className="h-5 w-5 text-primary" />
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <div className="rounded-lg p-3 bg-muted text-foreground">
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Thinking...</span>
                        </div>
                        {showThinking && (
                          <Card className="mt-2 bg-muted/50">
                            <CardContent className="p-3">
                              <pre className="text-xs whitespace-pre-wrap font-mono text-muted-foreground">
                                Analyzing your request...{"\n\n"}
                                Retrieving relevant procurement data...{"\n\n"}
                                Processing information and generating insights...{"\n\n"}
                                Formulating response based on historical patterns and current data...
                              </pre>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
          <div className="border-t p-4">
            <div className="max-w-4xl mx-auto">
              {attachedFile && (
                <div className="mb-2 flex items-center gap-2 p-2 bg-muted rounded-lg">
                  <Attachment className="h-4 w-4" />
                  <span className="text-sm flex-1 truncate">{attachedFile.name}</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleRemoveAttachment}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <div className="flex items-end gap-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-full h-10 w-10" 
                  onClick={handleAttachmentClick}
                  disabled={isThinking}
                >
                  <Attachment className="h-5 w-5" />
                  <span className="sr-only">Attach file</span>
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept="*/*"
                />
                <div className="flex-1 relative">
                  <Input
                    placeholder="Ask me anything about procurement..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                    className="pr-10 py-6 min-h-[50px] max-h-[200px] overflow-y-auto resize-none"
                    disabled={isThinking}
                  />
                  {inputValue && (
                    <Button
                      size="icon"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-full"
                      onClick={handleSendMessage}
                      disabled={isThinking}
                    >
                      <Send className="h-4 w-4" />
                      <span className="sr-only">Send</span>
                    </Button>
                  )}
                </div>
                <Button
                  variant={isRecording ? "default" : "outline"}
                  size="icon"
                  className={`rounded-full h-10 w-10 ${isRecording ? "bg-red-500 hover:bg-red-600" : ""}`}
                  onClick={toggleRecording}
                  disabled={isThinking}
                >
                  <Mic className="h-5 w-5" />
                  <span className="sr-only">Voice input</span>
                </Button>
              </div>
              <div className="mt-2 text-xs text-center text-muted-foreground">
                AI Assistant can make mistakes. Consider checking important information.
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Conversation History</h2>
              <Button onClick={handleStartNewConversation}>New Conversation</Button>
            </div>
            
            {conversationHistory.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Bot className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No conversation history yet.</p>
                  <p className="text-sm text-muted-foreground mt-2">Start a conversation to see it here.</p>
                </CardContent>
              </Card>
            ) : (
              <ScrollArea className="max-h-[calc(100vh-12rem)]">
                <div className="space-y-3">
                  {conversationHistory.map((conversation) => (
                    <Card key={conversation.id} className="hover:bg-muted/50 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 cursor-pointer" onClick={() => handleLoadConversation(conversation.id)}>
                            <h3 className="font-semibold mb-1">{conversation.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {conversation.messages.length} messages
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatDate(conversation.timestamp)}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteConversation(conversation.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </div>
      )}

      {activeTab === 'saved' && (
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Saved Responses</h2>
            
            {savedResponses.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Download className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No saved responses yet.</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Save important AI responses by clicking "Save response" in the chat.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <ScrollArea className="max-h-[calc(100vh-12rem)]">
                <div className="space-y-4">
                  {savedResponses.map((saved) => (
                    <Card key={saved.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <h3 className="font-semibold">{saved.title}</h3>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              {formatDate(saved.timestamp)}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleCopyToClipboard(saved.content)}
                            >
                              <Download className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleDeleteSavedResponse(saved.id)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                          {saved.content}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </div>
      )}
    </SidebarInset>
  )
}
