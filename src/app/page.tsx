"use client";

import { Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Autoplay from 'embla-carousel-autoplay';
import messages from '@/messages.json';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-800 text-white">

      {/* Main Content */}
      <main
        className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/feedback_image.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
      >

        {/* Hero Section */}
        <section className="text-center mb-10 md:mb-16 px-6 py-6 rounded-xl max-w-3xl w-full" style={{ backdropFilter: 'blur(6px)', backgroundColor: 'rgba(0, 0, 0, 0.65)' }} >
          <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
            <span className="text-4xl md:text-6xl text-yellow-400 block mb-2">
              Secret Ping
            </span>
            Share Freely, Stay Anonymous
          </h1>
          <p className="mt-5 text-base md:text-lg text-gray-300">
            Let others message you without ever knowing who they are.
            <br className="hidden md:inline" />
            An open space for honest feedback, deep thoughts, or just fun anonymous notes.
          </p>
        </section>

        {/* Message Carousel */}
        <Carousel
          plugins={[Autoplay({ delay: 3000 })]}
          className="w-full max-w-md md:max-w-lg rounded-xl overflow-hidden backdrop-blur-md shadow-2xl"
        >
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index} className="p-4">
                <Card className="bg-white/60 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-gray-800">
                      {message.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
                    <Mail className="flex-shrink-0 text-gray-700" />
                    <div>
                      <p className="text-gray-800">{message.content}</p>
                      <p className="text-xs text-gray-500 mt-2">{message.received}</p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </main>
    </div>

  );
}
