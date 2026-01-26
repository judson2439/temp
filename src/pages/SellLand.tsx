import React, { useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { InstantOfferForm } from '@/components/SellLand';

export default function SellLand() {
  useEffect(() => {
    document.title = 'Get Offer | Summit Land USA';

  }, []);

  return (
    <div className="flex flex-col">
      <main className="flex-grow pt-20">
        <InstantOfferForm />
      </main>
    </div>
  );
}

