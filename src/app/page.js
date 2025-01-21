"use client"
import Link from "next/link";
import { Building2, Shield, Users, Clock, CheckCircle, Menu, X } from 'lucide-react';
import { motion } from "framer-motion";
import React, { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const benefits = [
    "Expert Project Management",
    "Industry-Leading Solutions",
    "Comprehensive Safety Standards",
    "Professional Team Communication",
    "Detailed Progress Tracking",
    "Modern Equipment Management",
    "Strategic Planning",
    "Complete Documentation System",
    "Budget Optimization",
    "24/7 Support"
  ];


  const features = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "Expert Team",
      desc: "Professional workforce management by industry experts",
      image: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?q=80&w=400"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Safety First",
      desc: "Maintain high safety standards with real-time monitoring",
      image: "https://images.unsplash.com/photo-1581141849291-1125c7b692b5?q=80&w=400"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Time Tracking",
      desc: "Smart attendance and productivity tracking system",
      image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=400"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="relative min-h-screen md:min-h-[90vh] overflow-hidden pb-32 md:pb-40">
        <div className="absolute inset-0">
          <video
            autoPlay
            loop
            muted
            className="w-full h-full object-cover"
          >
            <source src="https://videos.pexels.com/video-files/856350/856350-hd_1920_1080_30fps.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/95 via-blue-800/90 to-blue-700/85"></div>
        </div>
        <nav className="relative z-50 sticky top-0">
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16 md:h-20">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex items-start"
              >
                <div className="relative w-[240px] md:w-[300px] h-[96px] md:h-[128px]">
                  <Image
                    src="/whitelogo1.png"
                    alt="SiteManage"
                    fill
                    style={{ objectFit: 'contain' }}
                    priority
                  />
                </div>
              </motion.div>

              <div className="md:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-white p-2"
                >
                  {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </div>
              <div className="hidden md:flex items-center space-x-4">
                <Link href="/login">
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    className="bg-blue-600/10 text-white hover:bg-blue-600/20 transition px-6 py-2 rounded-full font-medium backdrop-blur-sm"
                  >
                    Login
                  </motion.span>
                </Link>
                <Link href="/signup">
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    className="bg-white text-blue-600 px-6 py-2 rounded-full font-medium hover:bg-blue-50 transition-all shadow-lg"
                  >
                    Sign Up
                  </motion.span>
                </Link>
                <Link href="/join">
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    className="bg-white text-blue-600 px-6 py-2 rounded-full font-medium hover:bg-blue-50 transition-all shadow-lg"
                  >
                    Join As Contractor
                  </motion.span>
                </Link>
              </div>
            </div>
            {isMenuOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/40 backdrop-blur-lg z-40"
                  onClick={() => setIsMenuOpen(false)}
                />
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: "spring", damping: 20 }}
                  className="fixed top-0 right-0 h-full w-[80%] bg-white shadow-2xl py-6 px-4 z-50"
                >
                  <div className="flex justify-end mb-6">
                    <button onClick={() => setIsMenuOpen(false)}>
                      <X className="h-6 w-6 text-gray-600" />
                    </button>
                  </div>
                  <div className="flex flex-col space-y-4">
                    <Link href="/login">
                      <motion.span
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="block bg-blue-600/10 text-blue-600 px-4 py-4 rounded-xl font-medium transition-all hover:bg-blue-600/20 active:bg-blue-600/30"
                      >
                        Login
                      </motion.span>
                    </Link>
                    <Link href="/signup">
                      <motion.span
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="block bg-blue-600 text-white px-4 py-4 rounded-xl font-medium transition-all text-center hover:bg-blue-700 active:bg-blue-800"
                      >
                        Sign Up
                      </motion.span>
                    </Link>
                    <Link href="/join">
                      <motion.span
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="block bg-gray-100 text-gray-700 px-4 py-4 rounded-xl font-medium transition-all text-center hover:bg-gray-200 active:bg-gray-300"
                      >
                        Join As Contractor
                      </motion.span>
                    </Link>
                  </div>
                </motion.div>
              </>
            )}
          </div>
        </nav>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-32">
          <motion.div {...fadeInUp} className="text-center">
            <h1 className="text-2xl sm:text-4xl md:text-7xl font-bold text-white mb-4 md:mb-6 leading-tight">
              Excellence in<br />Construction Management
            </h1>
            <p className="text-base sm:text-xl md:text-2xl text-blue-100 mb-6 md:mb-12 max-w-3xl mx-auto leading-relaxed px-2">
              Building tomorrow's infrastructure with expertise, innovation, and dedication
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4 px-4">
              <Link href="/signup">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
                >
                  Get Started
                </motion.button>
              </Link>
              <Link href="/login">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-blue-600/10 backdrop-blur-sm text-white border border-white/30 px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-600/20 transition-all"
                >
                  Sign In
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="relative mt-20 md:absolute md:bottom-0 md:left-0 md:right-0 md:transform md:translate-y-1/2 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
              {[
                { number: "20+", label: "Years Experience" },
                { number: "500+", label: "Projects Completed" },
                { number: "100%", label: "Client Satisfaction" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  {...fadeInUp}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl md:rounded-2xl p-4 md:p-8 shadow-xl hover:shadow-2xl transition-all border border-gray-100"
                >
                  <div className="text-xl md:text-3xl font-bold text-blue-600 mb-1">{stat.number}
                  <div className="text-sm md:text-base text-blue-600">{stat.label}</div>
                  </div>
                  <div className="text-lg md:text-3xl text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-16 md:py-32 bg-white mt-8 md:mt-0"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-20"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-3 md:mb-4">Powerful Features</h2>
            <p className="text-lg md:text-xl text-gray-600">Everything you need to manage your construction site</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-8">
                  <div className="h-14 w-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative py-16 md:py-32 bg-gray-50"
      >
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=2070"
            className="w-full h-full object-cover opacity-5"
            alt="Construction Background"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-3 md:mb-4">Why Choose Us</h2>
            <div className="w-20 md:w-24 h-1 bg-blue-600 mx-auto"></div>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-6 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-3 md:space-x-4 bg-white/90 backdrop-blur-lg p-4 md:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                <div className="bg-blue-100 p-2 md:p-3 rounded-full flex-shrink-0">
                  <CheckCircle className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
                </div>
                <span className="text-sm md:text-base text-gray-700 font-medium">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      <footer className="bg-gray-900 text-gray-400 mt-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col items-center">
            <div className="flex items-center text-white mb-6">
              <Building2 className="h-8 w-8 mr-2" />
              <span className="text-xl font-bold">Constrallianz</span>
            </div>
            <p className="text-sm text-center mb-6 max-w-md">
              Empowering construction sites with modern management solutions and innovative technologies.
            </p>
            <div className="border-t border-gray-800 w-full mt-8 pt-8 text-center text-sm">
              <p>&copy; {new Date().getFullYear()} Constrallianz. All rights reserved.</p>
              <p>support@constrallianz.com</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}