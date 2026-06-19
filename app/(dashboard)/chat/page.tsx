"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Bot, Package, TrendingUp, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";

const suggestions = [
  "¿Cuál es el stock actual?",
  "Ventas de esta semana",
  "Productos con stock bajo",
  "¿Qué producto es más rentable?",
];

const initialMessages = [
  {
    id: 1,
    type: "bot",
    content: "¡Hola! Soy el asistente empresarial de Flowity.iq. ¿En qué puedo ayudarte hoy?",
    timestamp: "10:00",
  },
];

export default function ChatPage() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: "user",
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    const userInput = input;
    setInput("");

    try {
      const response = await api.chat(userInput);
      const botResponse = {
        id: messages.length + 2,
        type: "bot",
        content: response.respuesta,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      const errorMessage = {
        id: messages.length + 2,
        type: "bot",
        content: "Lo siento, hubo un error al procesar tu consulta. Por favor, intenta nuevamente.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };


  return (
    <div className="flex flex-col h-[calc(100vh-7rem)]">
      <div className="shrink-0 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Asistente Empresarial</h1>
        <p className="text-muted-foreground mt-1">
          Consulta información de tu negocio mediante conversación
        </p>
      </div>

      <Card className="flex flex-col min-h-0 flex-1 overflow-hidden">
        <CardHeader className="border-b shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <Bot className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <CardTitle>Flowity Assistant</CardTitle>
              <CardDescription>Especializado en consultas empresariales</CardDescription>
            </div>
          </div>
        </CardHeader>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.type === "user" ? "justify-end" : ""}`}
              >
                {message.type === "bot" && (
                  <Avatar className="w-8 h-8 shrink-0">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      F
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.type === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <span className="text-xs opacity-70 mt-1 block">{message.timestamp}</span>
                </div>
                {message.type === "user" && (
                  <Avatar className="w-8 h-8 shrink-0">
                    <AvatarFallback className="bg-muted text-xs">JD</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="border-t p-4 space-y-3 shrink-0">
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion) => (
              <Button
                key={suggestion}
                variant="outline"
                size="sm"
                onClick={() => {
                  setInput(suggestion);
                }}
              >
                {suggestion.includes("stock") && <Package className="mr-1 h-3 w-3" />}
                {suggestion.includes("Ventas") && <TrendingUp className="mr-1 h-3 w-3" />}
                {suggestion.includes("bajo") && <AlertCircle className="mr-1 h-3 w-3" />}
                {suggestion}
              </Button>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Input
              placeholder="Escribe tu consulta..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <Button onClick={handleSend} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
