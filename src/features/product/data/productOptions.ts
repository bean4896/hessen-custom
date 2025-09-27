import { TabConfig } from '../types';
import { generatePlaceholderDataUrl } from '../../../shared/utils/imageGenerator';

export const productTabs: TabConfig[] = [
  {
    id: 'material',
    label: 'Material',
    category: 'material',
    options: [
      {
        id: 'rubberwood',
        title: 'Rubberwood',
        price: 0,
        image: 'https://hessen.sg/wp-content/uploads/2024/02/natural_rubber.webp',
        description: 'Sustainable hardwood with natural grain'
      },
      {
        id: 'pinewood',
        title: 'Pinewood',
        price: 149,
        image: 'https://hessen.sg/wp-content/uploads/2023/04/natural_pine.png',
        description: 'Light softwood with natural knots'
      },
      {
        id: 'teakwood',
        title: 'Teakwood',
        price: 599,
        image: 'https://hessen.sg/wp-content/uploads/2024/02/teak_indo.webp',
        description: 'Premium tropical hardwood with rich grain'
      },
      {
        id: 'oakwood',
        title: 'Oakwood',
        price: 299,
        image: 'https://hessen.sg/wp-content/uploads/2023/04/natural_oak.png',
        description: 'Premium hardwood with rich texture'
      },
      {
        id: 'blackwalnut',
        title: 'Black Walnut',
        price: 499,
        image: 'https://hessen.sg/wp-content/uploads/2024/07/black-walnut-1500x1500-2024-07-29.webp',
        description: 'Luxury wood with deep chocolate tones'
      },
      {
        id: 'cherrywood',
        title: 'Cherrywood',
        price: 399,
        image: 'https://hessen.sg/wp-content/uploads/2024/07/cherrywood-1500x1499-2024-07-29.webp',
        description: 'Elegant hardwood with warm reddish tones'
      },
      {
        id: 'ashwood',
        title: 'Ashwood',
        price: 349,
        image: 'https://hessen.sg/wp-content/uploads/2024/07/ashwood-1500x1500-2024-07-29.webp',
        description: 'Strong hardwood with distinctive grain pattern'
      },
      {
        id: 'hinoki',
        title: 'Hinoki',
        price: 799,
        image: 'https://hessen.sg/wp-content/uploads/2024/11/hinoki-P-2024-11-08_cropped-1500x1500-2024-11-08.webp',
        description: 'Premium Japanese cypress with natural fragrance'
      },
      {
        id: 'hpl-laminate',
        title: 'HPL Laminate',
        price: 99,
        image: 'https://hessen.sg/wp-content/uploads/2024/02/hpl-circle2-min.jpg',
        description: 'Durable high-pressure laminate finish'
      }
    ]
  },
  {
    id: 'finishColour',
    label: 'Finish',
    category: 'finishColour',
    options: [
      {
        id: 'natural',
        title: 'Natural',
        price: 0,
        image: generatePlaceholderDataUrl(300, 300, 'D2B48C', '000000', 'Natural'),
        description: 'Clear protective finish'
      },
      {
        id: 'honey',
        title: 'Honey',
        price: 79,
        image: generatePlaceholderDataUrl(300, 300, 'FDB813', '000000', 'Honey'),
        description: 'Warm golden tone'
      },
      {
        id: 'coal',
        title: 'Coal',
        price: 99,
        image: generatePlaceholderDataUrl(300, 300, '36454F', 'FFFFFF', 'Coal'),
        description: 'Deep charcoal finish'
      },
      {
        id: 'white',
        title: 'White',
        price: 89,
        image: generatePlaceholderDataUrl(300, 300, 'F8F8FF', '000000', 'White'),
        description: 'Clean modern white'
      }
    ]
  },
  {
    id: 'size',
    label: 'Bed Size',
    category: 'size',
    options: [
      {
        id: 'single',
        title: 'Single',
        price: 0,
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJiZWQxIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojRjBGOEZGO3N0b3Atb3BhY2l0eToxIiAvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I0U2RTZGQTtzdG9wLW9wYWNpdHk6MSIgLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0idXJsKCNiZWQxKSIvPjxyZWN0IHg9IjYwIiB5PSI0MCIgd2lkdGg9IjE4MCIgaGVpZ2h0PSIyMjAiIGZpbGw9IiM4QjQ1MTMiIHJ4PSI4Ii8+PHJlY3QgeD0iNzAiIHk9IjUwIiB3aWR0aD0iMTYwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI0ZGRkZGRiIgcng9IjQiLz48cmVjdCB4PSI4MCIgeT0iNjAiIHdpZHRoPSIxNDAiIGhlaWdodD0iMTgwIiBmaWxsPSIjRjBGOEZGIiByeD0iNCIvPjx0ZXh0IHg9IjE1MCIgeT0iMTMwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSIjNDQ0Ij5TSU5HTEUgQkVEPC90ZXh0Pjx0ZXh0IHg9IjE1MCIgeT0iMTUwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM2NjYiPjkwIHggMTkwIGNtPC90ZXh0Pjx0ZXh0IHg9IjE1MCIgeT0iMTcwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM4ODgiPklkZWFsIGZvciBraWRzPC90ZXh0PjwvcmVjdD48L3N2Zz4=',
        description: '90 x 190 cm - Perfect for children or small spaces'
      },
      {
        id: 'Supersingle',
        title: 'Supersingle',
        price: 200,
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJiZWQyIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojRkZGQUZBO3N0b3Atb3BhY2l0eToxIiAvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I0REQTBERC5zdG9wLW9wYWNpdHk6MSIgLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0idXJsKCNiZWQyKSIvPjxyZWN0IHg9IjQwIiB5PSI0MCIgd2lkdGg9IjIyMCIgaGVpZ2h0PSIyMjAiIGZpbGw9IiM4QjQ1MTMiIHJ4PSI4Ii8+PHJlY3QgeD0iNTAiIHk9IjUwIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI0ZGRkZGRiIgcng9IjQiLz48cmVjdCB4PSI2MCIgeT0iNjAiIHdpZHRoPSIxODAiIGhlaWdodD0iMTgwIiBmaWxsPSIjRkZGQUZBIiByeD0iNCIvPjx0ZXh0IHg9IjE1MCIgeT0iMTMwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSIjNDQ0Ij5ET1VCTEUgQkVEPC90ZXh0Pjx0ZXh0IHg9IjE1MCIgeT0iMTUwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM2NjYiPjEzNSB4IDE5MCBjbTwvdGV4dD48dGV4dCB4PSIxNTAiIHk9IjE3MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjODg4Ij5Db21wYWN0IGZvciB0d288L3RleHQ+PC9yZWN0Pjwvc3ZnPg==',
        description: '135 x 190 cm - Cozy for couples in smaller rooms'
      },
      {
        id: 'queen',
        title: 'Queen',
        price: 250,
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJiZWQzIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojRkZGNUZGO3N0b3Atb3BhY2l0eToxIiAvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I0RBNzBENjtzdG9wLW9wYWNpdHk6MSIgLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0idXJsKCNiZWQzKSIvPjxyZWN0IHg9IjMwIiB5PSIzNSIgd2lkdGg9IjI0MCIgaGVpZ2h0PSIyMzAiIGZpbGw9IiM4QjQ1MTMiIHJ4PSI4Ii8+PHJlY3QgeD0iNDAiIHk9IjQ1IiB3aWR0aD0iMjIwIiBoZWlnaHQ9IjIxMCIgZmlsbD0iI0ZGRkZGRiIgcng9IjQiLz48cmVjdCB4PSI1MCIgeT0iNTUiIHdpZHRoPSIyMDAiIGhlaWdodD0iMTkwIiBmaWxsPSIjRkZGNUZGIiByeD0iNCIvPjx0ZXh0IHg9IjE1MCIgeT0iMTMwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSIjNDQ0Ij5RVUVFTIBERUQ8L3RleHQ+PHRleHQgeD0iMTUwIiB5PSIxNTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY2NiI+MTUwIHggMjAwIGNtPC90ZXh0Pjx0ZXh0IHg9IjE1MCIgeT0iMTcwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM4ODgiPk1vc3QgcG9wdWxhciBzaXplPC90ZXh0PjwvcmVjdD48L3N2Zz4=',
        description: '150 x 200 cm - Most popular size for couples'
      },
      {
        id: 'king',
        title: 'King',
        price: 299,
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJiZWQ0IiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojRjBFNkZGO3N0b3Atb3BhY2l0eToxIiAvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I0JBNTVEN1N0b3Atb3BhY2l0eToxIiAvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSJ1cmwoI2JlZDQpIi8+PHJlY3QgeD0iMjAiIHk9IjMwIiB3aWR0aD0iMjYwIiBoZWlnaHQ9IjI0MCIgZmlsbD0iIzhCNDUxMyIgcng9IjgiLz48cmVjdCB4PSIzMCIgeT0iNDAiIHdpZHRoPSIyNDAiIGhlaWdodD0iMjIwIiBmaWxsPSIjRkZGRkZGIiByeD0iNCIvPjxyZWN0IHg9IjQwIiB5PSI1MCIgd2lkdGg9IjIyMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNGMEU2RkYiIHJ4PSI0Ii8+PHRleHQgeD0iMTUwIiB5PSIxMzAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiM0NDQiPktJTkcgQkVEPC90ZXh0Pjx0ZXh0IHg9IjE1MCIgeT0iMTUwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM2NjYiPjE4MCAyMDAgY208L3RleHQ+PHRleHQgeD0iMTUwIiB5PSIxNzAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzg4OCI+TWF4aW11bSBjb21mb3J0PC90ZXh0PjwvcmVjdD48L3N2Zz4=',
        description: '180 x 200 cm - Maximum comfort and space'
      }
    ]
  },
  {
    id: 'headboard',
    label: 'Headboard',
    category: 'headboard',
    options: [
      {
        id: 'panel',
        title: 'Panel',
        price: 0,
        image: generatePlaceholderDataUrl(300, 300, '98FB98', '000000', 'Panel'),
        description: 'Simple flat panel design'
      },
      {
        id: 'slat',
        title: 'Slat',
        price: 149,
        image: generatePlaceholderDataUrl(300, 300, '90EE90', '000000', 'Slat'),
        description: 'Vertical slat pattern'
      },
      {
        id: 'upholstered',
        title: 'Upholstered',
        price: 399,
        image: generatePlaceholderDataUrl(300, 300, '32CD32', '000000', 'Upholstered'),
        description: 'Padded fabric headboard'
      },
      {
        id: 'none',
        title: 'No Headboard',
        price: 0,
        image: generatePlaceholderDataUrl(300, 300, 'F0F8FF', '000000', 'None'),
        description: 'Minimalist frame only'
      }
    ]
  },
  {
    id: 'bedframeBody',
    label: 'Frame Base',
    category: 'bedframeBody',
    options: [
      {
        id: 'platform',
        title: 'Platform',
        price: 0,
        image: generatePlaceholderDataUrl(300, 300, 'FFB6C1', '000000', 'Platform'),
        description: 'Solid platform base'
      },
      {
        id: 'slats',
        title: 'Slats',
        price: 79,
        image: generatePlaceholderDataUrl(300, 300, 'FFC0CB', '000000', 'Slats'),
        description: 'Ventilated slat system'
      },
      {
        id: 'storage',
        title: 'Storage',
        price: 449,
        image: generatePlaceholderDataUrl(300, 300, 'FF69B4', '000000', 'Storage'),
        description: 'Built-in storage drawers'
      },
      {
        id: 'adjustable',
        title: 'Adjustable',
        price: 699,
        image: generatePlaceholderDataUrl(300, 300, 'FF1493', 'FFFFFF', 'Adjustable'),
        description: 'Electric adjustable base'
      }
    ]
  },
  {
    id: 'optional',
    label: 'Optional',
    category: 'optional',
    options: [
      {
        id: 'mattress',
        title: 'Premium Mattress',
        price: 899,
        image: generatePlaceholderDataUrl(300, 300, 'F0E68C', '000000', 'Mattress'),
        description: 'Memory foam mattress'
      },
      {
        id: 'bedding',
        title: 'Bedding Set',
        price: 199,
        image: generatePlaceholderDataUrl(300, 300, 'FFFFE0', '000000', 'Bedding'),
        description: 'Premium cotton bedding'
      },
      {
        id: 'nightstand',
        title: 'Matching Nightstand',
        price: 299,
        image: generatePlaceholderDataUrl(300, 300, 'FFFACD', '000000', 'Nightstand'),
        description: 'Coordinating side table'
      },
      {
        id: 'warranty',
        title: 'Extended Warranty',
        price: 149,
        image: generatePlaceholderDataUrl(300, 300, 'F5F5DC', '000000', 'Warranty'),
        description: '5-year protection plan'
      }
    ]
  }
];
