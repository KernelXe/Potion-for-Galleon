import React, { useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import PotionCard from '../components/PotionCard';
import CartPlanner from '../components/CartPlanner';
import InventoryCalculator from '../components/InventoryCalculator';
import PotionSelector from '../components/PotionSelector';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { APP_VERSION } from '@/lib/version';

const HomeSkeleton = () => (
  <div className="space-y-6">
    <Card className="gap-4 py-6">
      <CardHeader className="px-6 pb-0">
        <div className="flex items-start gap-3.5">
          <Skeleton className="size-9 rounded-md" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-72 max-w-full" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 px-6">
        <Skeleton className="h-10 w-full" />
        <div className="flex flex-wrap gap-1.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-24 rounded-full" />
          ))}
        </div>
      </CardContent>
    </Card>
    <div className="grid gap-6 lg:grid-cols-2">
      <Skeleton className="h-72 rounded-xl" />
      <Skeleton className="h-72 rounded-xl" />
    </div>
    <Skeleton className="h-96 rounded-xl" />
  </div>
);

const EmptyState = () => (
  <Card className="flex min-h-[280px] flex-col items-center justify-center py-16 text-center text-muted-foreground">
    <i className="bxf bx-flask-round mb-4 text-6xl text-primary/45" />
    <p>กรุณาเลือกสูตรยาเพื่อดูรายละเอียด</p>
  </Card>
);

const NoPotionsState = () => (
  <Card className="flex min-h-[200px] flex-col items-center justify-center gap-2 py-12 text-center">
    <i className="bx bx-package mb-2 text-5xl text-primary/40" />
    <h4 className="font-heading text-lg text-white">ยังไม่มีสูตรยาในระบบ</h4>
    <p className="max-w-sm text-sm text-muted-foreground">
      ผู้ดูแลสามารถเพิ่มสูตรยาได้ที่หน้า <span className="font-mono text-foreground">/admin</span>
    </p>
  </Card>
);

const Home = () => {
  const { potions, isLoading } = useAppData();
  const [selectedPotionId, setSelectedPotionId] = useState('');
  const selectedPotion = potions.find((p) => p.id === selectedPotionId);

  return (
    <div className="flex flex-col gap-6 pb-12 pt-2">
      <div className="flex items-center justify-end">
        <span className="rounded-full border border-border/40 px-2.5 py-0.5 font-heading text-[10px] tracking-[0.18em] text-muted-foreground/70">
          {APP_VERSION}
        </span>
      </div>

      {isLoading ? (
        <HomeSkeleton />
      ) : potions.length === 0 ? (
        <NoPotionsState />
      ) : (
        <>
          <Card className="gap-4 py-6">
            <CardHeader className="px-6 pb-0">
              <div className="flex items-start gap-3.5">
                <i className="bx bx-search-alt mt-1 text-3xl text-primary" />
                <div>
                  <CardTitle className="mb-1 font-heading text-xl text-white">Select Potion Recipe</CardTitle>
                  <CardDescription>
                    ค้นหาและเลือกสูตรยา — ใช้ร่วมกันทั้งตารางคราฟ สูตรยา และระบบคำนวณวัตถุดิบ
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-6">
              <PotionSelector
                potions={potions}
                value={selectedPotionId}
                onChange={setSelectedPotionId}
              />
            </CardContent>
          </Card>

          <div className="grid items-start gap-6 lg:grid-cols-2">
            <CartPlanner
              selectedPotionId={selectedPotionId}
              onPotionChange={setSelectedPotionId}
            />

            <section className="flex flex-col gap-4">
              <h3 className="flex items-center gap-2.5 font-heading text-xl text-white">
                <i className="bx bx-book-bookmark text-primary" /> All Potion Recipes
              </h3>
              {selectedPotion ? (
                <PotionCard potion={selectedPotion} />
              ) : (
                <EmptyState />
              )}
            </section>
          </div>

          <InventoryCalculator selectedPotionId={selectedPotionId} />
        </>
      )}
    </div>
  );
};

export default Home;
