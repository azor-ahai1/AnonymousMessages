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
    <div className="flex flex-col h-screen bg-gray-800 text-white">
      {/* Main Content */}
      <main
        className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/feedback_image.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backdropFilter: 'blur(5px)',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backgroundBlendMode: 'overlay',
        }}
      >
        {/* Hero Section */}
        <section
          className="text-center mb-8 md:mb-12 p-6 rounded-lg"
          style={{
            backdropFilter: 'blur(5px)',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
          }}
        >
          <h1 className="text-3xl md:text-5xl font-bold text-gray-100">
            Dive into the World of Anonymous Feedback
          </h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg text-gray-100">
            Secret Ping - Where your identity remains a secret.
          </p>
        </section>

        {/* Message Carousel */}
        <Carousel
          plugins={[Autoplay({ delay: 1400 })]}
          className="w-full max-w-md md:max-w-lg backdrop-blur-md rounded-lg shadow-lg overflow-hidden"
        >
          <CarouselContent>
            {messages.slice(0, 3).map((message, index) => (
              <CarouselItem key={index} className="p-4">
                <Card className="bg-white bg-opacity-50 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-gray-800">
                      {message.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
                    <Mail className="flex-shrink-0 text-gray-700" />
                    <div>
                      <p className="text-gray-800">{message.content}</p>
                      <p className="text-xs text-muted-foreground">{message.received}</p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </main>

      {/* Footer */}
      <footer className="p-4 md:p-6 bg-gray-900 text-center">
        © 2023 Secret Ping. All rights reserved.
      </footer>
    </div>
  );
}
