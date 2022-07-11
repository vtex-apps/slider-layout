import React from 'react'

export const mockInitialSlides = [
  <div key={1}>I am a slide. My index is 1</div>,
  <div key={2}>I am a slide. My index is 2</div>,
  <div key={3}>I am a slide. My index is 3</div>,
  <div key={4}>I am a slide. My index is 4</div>,
  <div key={5}>I am a slide. My index is 5</div>,
  <div key={6}>I am a slide. My index is 6</div>,
  <div key={7}>I am a slide. My index is 7</div>,
  <div key={8}>I am a slide. My index is 8</div>,
  <div key={9}>I am a slide. My index is 9</div>,
  <div key={10}>I am a slide. My index is 10</div>,
]

export const mockInitialInfiniteSliderState = {
  slideWidth: 5,
  slidesPerPage: 5,
  currentSlide: 0,
  transform: -25,
  transformMap: {
    0: -25,
    1: -30,
    2: -35,
    3: -40,
    4: -45,
    5: -50,
    6: -55,
    7: -60,
    8: -65,
    9: -70,
    10: -75,
    11: -80,
    12: -85,
    13: -90,
    14: -95,
    '-5': 0,
    '-4': -5,
    '-3': -10,
    '-2': -15,
    '-1': -20,
  },
  navigationStep: 2,
  slideTransition: {
    speed: 400,
    delay: 0,
    timing: '',
  },
  itemsPerPage: 5,
  label: 'slider',
  totalItems: 10,
  isPageNavigationStep: true,
  isOnTouchMove: false,
  useSlidingTransitionEffect: false,
}

export const mockInitialNonInfiniteSliderState = {
  slideWidth: 10,
  slidesPerPage: 5,
  currentSlide: 0,
  transform: 0,
  transformMap: {
    '0': 0,
    '1': -10,
    '2': -20,
    '3': -30,
    '4': -40,
    '5': -50,
    '6': -60,
    '7': -70,
    '8': -80,
    '9': -90,
  },
  navigationStep: 5,
  slideTransition: {
    speed: 400,
    delay: 0,
    timing: '',
  },
  itemsPerPage: 5,
  label: 'slider',
  totalItems: 10,
  isPageNavigationStep: true,
  isOnTouchMove: false,
  useSlidingTransitionEffect: false,
}
