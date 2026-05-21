"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Package, TrendingUp, AlertCircle } from "lucide-react";

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

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: "user",
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    setTimeout(() => {
      const botResponse = generateResponse(input);
      setMessages((prev) => [...prev, botResponse]);
    }, 500);
  };

  const generateResponse = (userInput: string) => {
    const input = userInput.toLowerCase();
    
    if (input.includes("stock") || input.includes("inventario")) {
      return {
        id: messages.length + 2,
        type: "bot",
        content: "Actualmente tienes 847 productos en stock. 12 productos están por debajo del mínimo recomendado, incluyendo Webcam HD (2 unidades) y Monitor 4K (3 unidades).",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
    }
    
    if (input.includes("venta") || input.includes("facturación")) {
      return {
        id: messages.length + 2,
        type: "bot",
        content: "Esta semana has realizado 89 ventas por un total de €12,450. El día con más ventas fue el martes con €3,240. El producto más vendido fue el Teclado Mecánico RGB.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
    }
    
    if (input.includes("rentable") || input.includes("margen")) {
      return {
        id: messages.length + 2,
        type: "bot",
        content: "El producto más rentable es la Laptop HP ProBook con un margen del 35%. Le siguen los Auriculares Bluetooth (28%) y los Monitores 27\" 4K (24%).",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
    }
    
    return {
      id: messages.length + 2,
      type: "bot",
      content: "Entiendo tu consulta. Como asistente especializado en Flowity.iq, puedo ayudarte con información sobre stock, ventas, proveedores y análisis de tu negocio. ¿Te gustaría saber algo específico?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
  };

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)]">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Asistente Empresarial</h1>
        <p className="text-muted-foreground mt-1">
          Consulta información de tu negocio mediante conversación
        </p>
      </div>

      <Card className="flex flex-col h-full">
        <CardHeader className="border-b">
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
        
        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 p-4">
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
            </div>
          </ScrollArea>

          <div className="border-t p-4 space-y-3">
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
        </CardContent>
      </Card>
    </div>
  );
}
