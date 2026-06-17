import React, { useMemo, useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import CurrencyDisplay from './CurrencyDisplay';
import NumberSliderInput, { parseNumber } from './NumberSliderInput';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

const STATUS = {
  available: {
    label: 'มีอยู่',
    icon: 'bx-check-circle',
    row: 'border-emerald-500/20 bg-emerald-500/5',
    badge: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
    text: 'text-emerald-400',
  },
  limiting: {
    label: 'ตัวจำกัด',
    icon: 'bx-error-circle',
    row: 'border-amber-500/25 bg-amber-500/8',
    badge: 'border-amber-500/35 bg-amber-500/12 text-amber-400',
    text: 'text-amber-400',
  },
  remaining: {
    label: 'เหลือ',
    icon: 'bx-package',
    row: 'border-sky-500/20 bg-sky-500/5',
    badge: 'border-sky-500/30 bg-sky-500/10 text-sky-400',
    text: 'text-sky-400',
  },
  missing: {
    label: 'ขาด',
    icon: 'bx-x-circle',
    row: 'border-destructive/25 bg-destructive/8',
    badge: 'border-destructive/35 bg-destructive/12 text-destructive',
    text: 'text-destructive',
  },
};

const calculateProduction = (potion, ingredients, userInventory, toTotalKnuts, toCurrencyObj) => {
  if (!potion || potion.ingredients.length === 0) return null;

  const rows = potion.ingredients.map((reqIng) => {
    const ing = ingredients.find((i) => i.id === reqIng.id);
    const owned = parseNumber(userInventory[reqIng.id], 0);
    const perBottle = reqIng.quantity;
    const maxFromThis = perBottle > 0 ? Math.floor(owned / perBottle) : Infinity;

    return {
      id: reqIng.id,
      name: ing?.name ?? 'ไม่ทราบ',
      owned,
      perBottle,
      maxFromThis: maxFromThis === Infinity ? 0 : maxFromThis,
    };
  });

  const maxBottles = rows.length > 0 ? Math.min(...rows.map((r) => r.maxFromThis)) : 0;
  const hasAnyInput = rows.some((r) => r.owned > 0);

  const limitingIds = new Set(
    rows.filter((r) => r.maxFromThis === maxBottles && r.perBottle > 0).map((r) => r.id)
  );

  const aspirationBottles = rows.length > 0
    ? Math.max(...rows.map((r) => (r.perBottle > 0 ? r.owned / r.perBottle : 0)))
    : 0;
  const bottlesToUseAll = Math.ceil(aspirationBottles);

  let totalMissingKnuts = 0;
  const enrichedRows = rows.map((row) => {
    const used = maxBottles * row.perBottle;
    const remaining = row.owned - used;
    const missingForFullUse = Math.max(0, bottlesToUseAll * row.perBottle - row.owned);

    if (missingForFullUse > 0) {
      const ing = ingredients.find((i) => i.id === row.id);
      if (ing) totalMissingKnuts += toTotalKnuts(ing.price) * missingForFullUse;
    }

    let status = 'available';
    if (limitingIds.has(row.id) && maxBottles > 0) status = 'limiting';
    else if (remaining > 0) status = 'remaining';

    return {
      ...row,
      used,
      remaining,
      missingForFullUse,
      status,
    };
  });

  const missingRows = enrichedRows.filter((r) => r.missingForFullUse > 0);

  return {
    maxBottles,
    hasAnyInput,
    bottlesToUseAll,
    limitingIngredients: enrichedRows.filter((r) => limitingIds.has(r.id)),
    rows: enrichedRows,
    missingRows,
    missingCost: toCurrencyObj(totalMissingKnuts),
  };
};

const ResultTable = ({ rows, showMissing = false }) => (
  <div className="overflow-hidden rounded-xl border border-border/60">
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-border/60 bg-muted/20 text-left text-xs text-muted-foreground">
          <th className="px-4 py-3 font-medium">วัตถุดิบ</th>
          <th className="px-4 py-3 font-medium text-right">มีอยู่</th>
          {!showMissing ? (
            <>
              <th className="hidden px-4 py-3 font-medium text-right sm:table-cell">ใช้ไป</th>
              <th className="px-4 py-3 font-medium text-right">เหลือ</th>
            </>
          ) : (
            <th className="px-4 py-3 font-medium text-right">ขาดเพิ่ม</th>
          )}
          <th className="px-4 py-3 font-medium text-right">สถานะ</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => {
          const statusKey = showMissing ? 'missing' : row.status;
          const meta = STATUS[statusKey] ?? STATUS.available;
          return (
            <tr
              key={row.id}
              className={cn(
                'border-b border-border/40 transition-colors duration-200 last:border-0',
                meta.row
              )}
            >
              <td className="px-4 py-3 font-medium">{row.name}</td>
              <td className="px-4 py-3 text-right tabular-nums">{row.owned}</td>
              {!showMissing ? (
                <>
                  <td className="hidden px-4 py-3 text-right tabular-nums sm:table-cell">{row.used}</td>
                  <td className={cn('px-4 py-3 text-right font-semibold tabular-nums', meta.text)}>
                    {row.remaining}
                  </td>
                </>
              ) : (
                <td className="px-4 py-3 text-right font-semibold tabular-nums text-destructive">
                  +{row.missingForFullUse}
                </td>
              )}
              <td className="px-4 py-3 text-right">
                <Badge variant="outline" className={cn('gap-1', meta.badge)}>
                  <i className={cn('bx text-sm', meta.icon)} />
                  {meta.label}
                </Badge>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

const InventoryCalculator = ({ selectedPotionId }) => {
  const { potions, ingredients, toTotalKnuts, toCurrencyObj } = useAppData();
  const [userInventory, setUserInventory] = useState({});

  const selectedPotion = potions.find((p) => p.id === selectedPotionId);

  const recipeIngredients = useMemo(() => {
    if (!selectedPotion) return [];
    return selectedPotion.ingredients.map((req) => {
      const ing = ingredients.find((i) => i.id === req.id);
      return { ...req, name: ing?.name ?? 'ไม่ทราบ' };
    });
  }, [selectedPotion, ingredients]);

  const handleInventoryChange = (ingId, value) => {
    if (value === '') {
      setUserInventory((prev) => {
        const next = { ...prev };
        delete next[ingId];
        return next;
      });
      return;
    }
    const num = Number(value);
    if (!Number.isNaN(num) && num >= 0) {
      setUserInventory((prev) => ({ ...prev, [ingId]: value }));
    }
  };

  const result = useMemo(
    () => calculateProduction(selectedPotion, ingredients, userInventory, toTotalKnuts, toCurrencyObj),
    [selectedPotion, ingredients, userInventory, toTotalKnuts, toCurrencyObj]
  );

  return (
    <Card className="gap-0 overflow-hidden py-0">
      <CardHeader className="border-b border-border/50 bg-gradient-to-r from-primary/5 to-transparent px-6 py-6">
        <CardTitle className="flex items-center gap-2.5 font-heading text-xl text-white">
          <span className="flex size-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <i className="bx bx-calculator text-xl" />
          </span>
          Material Production Calculator
        </CardTitle>
        <CardDescription className="max-w-2xl">
          กรอกจำนวนวัตถุดิบที่มีอยู่จริง — ระบบจะคำนวณจำนวนขวดที่ปรุงได้ ตัวจำกัดการผลิต และวัตถุดิบที่เหลือหลังการปรุง
        </CardDescription>
      </CardHeader>

      <CardContent className="px-6 py-6">
        {!selectedPotion ? (
          <div className="flex min-h-[200px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/10 p-8 text-center">
            <i className="bx bx-flask mb-3 text-5xl text-primary/40" />
            <p className="text-muted-foreground">เลือกสูตรยาด้านบนก่อนเพื่อเริ่มคำนวณ</p>
          </div>
        ) : (
          <div className="space-y-6">
            <Badge
              variant="outline"
              className="gap-2 border-gold/25 bg-primary/10 px-4 py-2 text-sm font-semibold text-gold"
            >
              <i className="bxf bx-flask-round" />
              {selectedPotion.name}
            </Badge>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <i className="bx bx-package text-lg text-gold" />
                  <h4 className="font-heading text-sm font-semibold tracking-wide text-gold">
                    วัตถุดิบที่คุณมี
                  </h4>
                </div>
                <ScrollArea className="h-[320px] pr-3">
                  <div className="space-y-2.5">
                    {recipeIngredients.map((req) => (
                      <div
                        key={req.id}
                        className="flex items-center justify-between gap-3 rounded-xl border border-border/50 bg-card/50 px-4 py-3 transition-colors duration-200 hover:border-primary/25 hover:bg-card"
                      >
                        <div className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold">{req.name}</span>
                          <span className="text-xs text-muted-foreground">
                            ใช้ {req.quantity} ต่อขวด
                          </span>
                        </div>
                        <NumberSliderInput
                          value={userInventory[req.id] ?? ''}
                          onChange={(val) => handleInventoryChange(req.id, val)}
                          min={0}
                          placeholder="0"
                          narrow
                        />
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              <div className="space-y-4">
                {!result?.hasAnyInput ? (
                  <div className="flex min-h-[320px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/10 p-6 text-center">
                    <i className="bx bx-edit-alt mb-3 text-4xl text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground">
                      กรอกจำนวนวัตถุดิบอย่างน้อย 1 ชนิดเพื่อดูผลลัพธ์
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 animate-in fade-in duration-300">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Card className="gap-2 border-primary/30 bg-primary/8 py-4 shadow-none">
                        <CardContent className="px-4 text-center">
                          <p className="text-xs text-muted-foreground">ปรุงได้สูงสุด</p>
                          <p className="font-heading text-4xl font-bold text-primary">
                            {result.maxBottles}
                          </p>
                          <p className="text-sm text-muted-foreground">ขวด</p>
                        </CardContent>
                      </Card>
                      <Card className="gap-2 border-gold/25 bg-gold/5 py-4 shadow-none">
                        <CardContent className="px-4 text-center">
                          <p className="text-xs text-muted-foreground">ใช้หมดทุกชนิดต้องปรุง</p>
                          <p className="font-heading text-4xl font-bold text-gold">
                            {result.bottlesToUseAll}
                          </p>
                          <p className="text-sm text-muted-foreground">ขวด</p>
                        </CardContent>
                      </Card>
                    </div>

                    {result.limitingIngredients.length > 0 && result.maxBottles > 0 && (
                      <Card className="gap-2 border-amber-500/25 bg-amber-500/5 py-4 shadow-none">
                        <CardContent className="px-4">
                          <div className="mb-2 flex items-center gap-2 text-amber-400">
                            <i className="bx bx-error-circle" />
                            <span className="text-sm font-semibold">ตัวจำกัดการผลิต</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {result.limitingIngredients.map((ing) => (
                              <Badge
                                key={ing.id}
                                variant="outline"
                                className="border-amber-500/35 bg-amber-500/10 text-amber-400"
                              >
                                {ing.name} (มี {ing.owned})
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {result.maxBottles === 0 && (
                      <Card className="gap-2 border-destructive/25 bg-destructive/5 py-4 shadow-none">
                        <CardContent className="flex items-center gap-3 px-4">
                          <i className="bx bx-x-circle text-2xl text-destructive" />
                          <p className="text-sm text-destructive">
                            วัตถุดิบไม่เพียงพอสำหรับการปรุงแม้แต่ 1 ขวด
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}
              </div>
            </div>

            {result?.hasAnyInput && result.maxBottles > 0 && (
              <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-center gap-2">
                  <i className="bx bx-list-ul text-lg text-primary" />
                  <h4 className="font-heading text-sm font-semibold text-white">
                    สรุปหลังปรุง {result.maxBottles} ขวด
                  </h4>
                </div>
                <ResultTable rows={result.rows} />
              </div>
            )}

            {result?.hasAnyInput && result.missingRows.length > 0 && (
              <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-center gap-2">
                  <i className="bx bx-cart-add text-lg text-destructive" />
                  <h4 className="font-heading text-sm font-semibold text-white">
                    วัตถุดิบที่ต้องซื้อเพิ่ม (หากต้องการใช้ทุกชนิดให้หมด)
                  </h4>
                </div>
                <ResultTable rows={result.missingRows} showMissing />
                <div className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/15 px-4 py-3 font-semibold">
                  <span className="text-sm">ค่าใช้จ่ายเพิ่มเติมโดยประมาณ:</span>
                  <CurrencyDisplay price={result.missingCost} />
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InventoryCalculator;
