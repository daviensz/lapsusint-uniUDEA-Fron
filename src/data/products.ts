import { Product } from '../types';
import warzoneImage from '../assets/warzone.png';
import rainbowSixImage from '../assets/rainbowsix.png';

export const products: Product[] = [
  {
    id: 'warzone-unlockall',
    product_name: 'WARZONE UNLOCKALL',
    price: 165000,
    image_url: warzoneImage,
    description: 'Unlock all content for Call of Duty: Warzone',
    features: [
      '🔑 Windows 10 & 11 (All Version) Supported',
      '🔗 Built-In Spoofer',
      '💾 Steam, Battle.Net Supported',
      '🏆 Alternate Accounts Preffered'
    ]
  },
  {
    id: 'rainbow-six-unlockall',
    product_name: 'RAINBOW SIX UNLOCKALL',
    price: 150000,
    image_url: rainbowSixImage,
    description: 'Unlock all content for Rainbow Six Siege',
    features: [
      '🔑 Windows 10 & 11 (All Version) Supported',
      '🔗 Built-In Spoofer',
      '💾 Steam, Battle.Net Supported',
      '🏆 Alternate Accounts Preffered'
    ]
  }
]; 