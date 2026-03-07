"use client"

import { useState } from "react"
import { ActivityIcon as Attachment, Bot, Download, Loader2, Mic, MoreHorizontal, Send, User } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample chat messages
const initialMessages = [
  {
    role: "assistant",
    content: "Hello! I'm your procurement AI assistant. How can I help you today?",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
  {
    role: "user",
    content: "Can you show me our top suppliers by spend for Q3?",
    timestamp: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
  },
  {
    role: "assistant",
    thinking:
      "Analyzing procurement data for Q3 2023...\n\nIdentifying top suppliers by total spend...\n\nCalculating spend percentages and year-over-year changes...\n\nGenerating visualization of top 5 suppliers...",
    content:
      "Here are your top 5 suppliers by spend for Q3 2023:\n\n1. Tech Solutions Inc. - $1.2M (15% of total spend, ↑8% YoY)\n2. Global Logistics Partners - $950K (12% of total spend, ↑3% YoY)\n3. Office Supplies Co. - $780K (10% of total spend, ↓2% YoY)\n4. Manufacturing Experts Ltd. - $650K (8% of total spend, ↑12% YoY)\n5. Professional Services Group - $520K (7% of total spend, ↑5% YoY)\n\nWould you like me to generate a detailed report or compare this with previous quarters?",
    timestamp: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
  },
  {
    role: "user",
    content: "Yes, please compare with previous quarters and highlight any significant changes.",
    timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
  },
  {
    role: "assistant",
    thinking:
      "Retrieving historical spend data for previous quarters...\n\nComparing Q3 2023 with Q2 2023 and Q1 2023...\n\nIdentifying significant changes in supplier rankings and spend amounts...\n\nAnalyzing spend patterns and trends...\n\nGenerating quarter-over-quarter comparison...",
    content:
      "Here's the quarterly comparison of your top suppliers:\n\n**Significant Changes:**\n\n1. **Tech Solutions Inc.** has consistently increased spend each quarter (Q1: $980K → Q2: $1.1M → Q3: $1.2M). This 22% YTD increase aligns with your IT infrastructure upgrade project.\n\n2. **Manufacturing Experts Ltd.** showed the largest jump from Q2 to Q3 (↑25%), moving from 6th to 4th place in your supplier ranking. This coincides with the new product line launch.\n\n3. **Office Supplies Co.** has declined for two consecutive quarters, dropping from 2nd place in Q1 to 3rd in Q3. This may reflect the ongoing remote work policy changes.\n\n4. **Creative Marketing Agency**, previously in your top 5, dropped to 7th place in Q3 with a 30% reduction in spend from Q2.\n\nWould you like me to generate a detailed report with recommendations based on these trends?",
    timestamp: new Date(Date.now() - 1000 * 60 * 1).toISOString(),
  },
]

export default function AIAssistant() {
  const [messages, setMessages] = useState(initialMessages)
  const [inputValue, setInputValue] = useState("")
  const [isThinking, setIsThinking] = useState(false)
  const [showThinking, setShowThinking] = useState(false)
  const [isRecording, setIsRecording] = useState(false)

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    // Add user message
    const userMessage = {
      role: "user",
      content: inputValue,
      timestamp: new Date().toISOString(),
    }
    setMessages([...messages, userMessage])
    setInputValue("")

    // Simulate AI thinking and response
    setIsThinking(true)
    setTimeout(() => {
      setShowThinking(true)
      setTimeout(() => {
        const assistantMessage = {
          role: "assistant",
          thinking:
            "Analyzing your request...\n\nRetrieving relevant procurement data...\n\nProcessing information and generating insights...\n\nFormulating response based on historical patterns and current data...",
          content:
            "I've analyzed your request and prepared a response based on our procurement data. Would you like me to generate a visualization or export this information to a report?",
          timestamp: new Date().toISOString(),
        }
        setMessages((prev) => [...prev, assistantMessage])
        setIsThinking(false)
        setShowThinking(false)
      }, 3000)
    }, 1000)
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    if (!isRecording) {
      // Simulate recording for 3 seconds then sending a message
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
          <Tabs defaultValue="chat">
            <TabsList>
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="saved">Saved</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-4xl mx-auto space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}>
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
                    <div className="text-xs text-muted-foreground">
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
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              Save response
                            </DropdownMenuItem>
                            <DropdownMenuItem>Copy to clipboard</DropdownMenuItem>
                            <DropdownMenuItem>Regenerate response</DropdownMenuItem>
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
          </div>
        </div>
        <div className="border-t p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end gap-2">
              <Button variant="outline" size="icon" className="rounded-full h-10 w-10" onClick={() => {}}>
                <Attachment className="h-5 w-5" />
                <span className="sr-only">Attach file</span>
              </Button>
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
    </SidebarInset>
  )
}
