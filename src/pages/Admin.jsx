import React, { useState } from 'react';
import { toast } from 'sonner';
import { useAppData } from '../context/AppDataContext';
import NumberSliderInput, { parseNumber } from '../components/NumberSliderInput';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { getCategoryMeta } from '@/lib/categoryMeta';
import ConfirmDialog from '../components/ConfirmDialog';

const SectionHeader = ({ icon, title, description, count, accent = 'text-primary' }) => (
  <div className="flex items-start justify-between gap-4">
    <div className="flex items-start gap-3">
      <span className={cn('flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10', accent)}>
        <i className={cn('bx text-xl', icon)} />
      </span>
      <div>
        <h3 className="font-heading text-lg font-semibold text-white">{title}</h3>
        {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
      </div>
    </div>
    {count !== undefined && (
      <Badge variant="secondary" className="shrink-0 tabular-nums">
        {count}
      </Badge>
    )}
  </div>
);

const DataRow = ({ children, actions, highlight }) => (
  <li
    className={cn(
      'flex items-center justify-between gap-3 rounded-xl border px-4 py-3 transition-colors duration-200',
      highlight
        ? 'border-primary/30 bg-primary/8'
        : 'border-border/40 bg-card/40 hover:border-border hover:bg-card/70'
    )}
  >
    <div className="min-w-0 flex-1 text-sm">{children}</div>
    <div className="flex shrink-0 items-center gap-0.5">{actions}</div>
  </li>
);

const AdminSkeleton = () => (
  <div className="space-y-8 pb-12">
    <div className="space-y-3">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-9 w-64" />
      <Skeleton className="h-4 w-72 max-w-full" />
    </div>
    <Skeleton className="h-12 w-full max-w-md" />
    <div className="grid gap-6 lg:grid-cols-2">
      <Skeleton className="h-56 rounded-xl" />
      <Skeleton className="h-56 rounded-xl" />
    </div>
  </div>
);

const Admin = () => {
  const { ingredients, setIngredients, potions, setPotions, categoryOrder, setCategoryOrder, isLoading } = useAppData();

  const [ingName, setIngName] = useState('');
  const [ingGalleon, setIngGalleon] = useState('');
  const [ingSickle, setIngSickle] = useState('');
  const [ingKnut, setIngKnut] = useState('');
  const [editingIngredientId, setEditingIngredientId] = useState(null);

  const [potName, setPotName] = useState('');
  const [potCategory, setPotCategory] = useState('');
  const [potImage, setPotImage] = useState('/assets/potion.png');
  const [potSteps, setPotSteps] = useState('');
  const [potSelectedIngs, setPotSelectedIngs] = useState([]);
  const [tempIngId, setTempIngId] = useState('');
  const [tempIngQty, setTempIngQty] = useState('');
  const [editingPotionId, setEditingPotionId] = useState(null);

  const [newCategory, setNewCategory] = useState('');

  const resetIngredientForm = () => {
    setEditingIngredientId(null);
    setIngName('');
    setIngGalleon('');
    setIngSickle('');
    setIngKnut('');
  };

  const handleEditIngredient = (ing) => {
    setEditingIngredientId(ing.id);
    setIngName(ing.name);
    setIngGalleon(String(ing.price.galleon));
    setIngSickle(String(ing.price.sickle));
    setIngKnut(String(ing.price.knut));
  };

  const saveIngredient = (e) => {
    e.preventDefault();
    if (!ingName.trim()) {
      toast.error('กรุณากรอกชื่อส่วนผสม');
      return;
    }

    const price = {
      galleon: parseNumber(ingGalleon, 0),
      sickle: parseNumber(ingSickle, 0),
      knut: parseNumber(ingKnut, 0),
    };

    if (editingIngredientId) {
      setIngredients(ingredients.map((i) => (i.id === editingIngredientId ? { ...i, name: ingName, price } : i)));
      toast.success('บันทึกส่วนผสมสำเร็จ');
    } else {
      setIngredients([...ingredients, { id: `i${Date.now()}`, name: ingName, price }]);
      toast.success('เพิ่มส่วนผสมสำเร็จ');
    }

    resetIngredientForm();
  };

  const removeIngredient = (id) => {
    const removed = ingredients.find((i) => i.id === id);
    setIngredients(ingredients.filter((i) => i.id !== id));
    if (editingIngredientId === id) resetIngredientForm();
    toast.success(removed ? `ลบ "${removed.name}" แล้ว` : 'ลบส่วนผสมสำเร็จ');
  };

  const addPotionIng = () => {
    const qty = parseNumber(tempIngQty, 0);
    if (!tempIngId) {
      toast.error('กรุณาเลือกส่วนผสม');
      return;
    }
    if (qty < 1) {
      toast.error('กรุณาระบุจำนวนอย่างน้อย 1');
      return;
    }
    const ing = ingredients.find((i) => i.id === tempIngId);
    setPotSelectedIngs([...potSelectedIngs, { id: tempIngId, quantity: qty }]);
    setTempIngQty('');
    toast.success(ing ? `เพิ่ม ${ing.name} x${qty}` : 'เพิ่มส่วนผสมในสูตรแล้ว');
  };

  const removePotionIng = (idxToRemove) => {
    const removed = potSelectedIngs[idxToRemove];
    const ing = removed ? ingredients.find((i) => i.id === removed.id) : null;
    setPotSelectedIngs(potSelectedIngs.filter((_, idx) => idx !== idxToRemove));
    if (ing) toast.info(`นำ ${ing.name} ออกจากสูตรแล้ว`);
  };

  const handleEditPotion = (pot) => {
    setEditingPotionId(pot.id);
    setPotName(pot.name);
    setPotCategory(pot.category);
    setPotImage(pot.image || '');
    setPotSteps(pot.steps.join('\n'));
    setPotSelectedIngs(pot.ingredients);
  };

  const cancelEditPotion = () => {
    setEditingPotionId(null);
    setPotName('');
    setPotCategory('');
    setPotSteps('');
    setPotSelectedIngs([]);
    setPotImage('/assets/potion.png');
  };

  const addPotion = (e) => {
    e.preventDefault();
    if (!potName.trim()) {
      toast.error('กรุณากรอกชื่อยา');
      return;
    }
    if (!potCategory.trim()) {
      toast.error('กรุณากรอกหมวดหมู่');
      return;
    }
    const stepsArray = potSteps.split('\n').filter((s) => s.trim() !== '');
    if (stepsArray.length === 0) {
      toast.error('กรุณากรอกขั้นตอนการปรุงอย่างน้อย 1 ขั้นตอน');
      return;
    }

    if (editingPotionId) {
      setPotions(
        potions.map((p) =>
          p.id === editingPotionId
            ? {
                ...p,
                name: potName,
                category: potCategory,
                image: potImage,
                steps: stepsArray,
                ingredients: potSelectedIngs,
              }
            : p
        )
      );
      cancelEditPotion();
      toast.success('บันทึกสูตรยาสำเร็จ');
    } else {
      const newPotion = {
        id: `p${Date.now()}`,
        name: potName,
        category: potCategory,
        image: potImage,
        steps: stepsArray,
        ingredients: potSelectedIngs,
      };
      setPotions([...potions, newPotion]);
      cancelEditPotion();
      toast.success('สร้างสูตรยาสำเร็จ');
    }
  };

  const removePotion = (id) => {
    const removed = potions.find((p) => p.id === id);
    setPotions(potions.filter((p) => p.id !== id));
    toast.success(removed ? `ลบ "${removed.name}" แล้ว` : 'ลบสูตรยาสำเร็จ');
  };

  const addCategory = () => {
    const name = newCategory.trim();
    if (!name) {
      toast.error('กรุณากรอกชื่อหมวดหมู่');
      return;
    }
    if (categoryOrder.includes(name)) {
      toast.warning('หมวดหมู่นี้มีอยู่แล้ว');
      return;
    }
    setCategoryOrder([...categoryOrder, name]);
    setNewCategory('');
    toast.success(`เพิ่มหมวดหมู่ "${name}" แล้ว`);
  };

  const removeCategory = (category) => {
    setCategoryOrder(categoryOrder.filter((c) => c !== category));
    toast.success(`ลบหมวดหมู่ "${category}" แล้ว`);
  };

  const moveCategory = (index, direction) => {
    const newOrder = [...categoryOrder];
    if (direction === 'up' && index > 0) {
      [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
    } else if (direction === 'down' && index < newOrder.length - 1) {
      [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    }
    setCategoryOrder(newOrder);
  };

  if (isLoading) return <AdminSkeleton />;

  return (
    <div className="space-y-8 pb-12">
      <header className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-1 text-sm font-medium text-primary">จัดการข้อมูล</p>
            <h1 className="font-heading text-3xl font-bold text-white sm:text-4xl">Admin Dashboard</h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              จัดการหมวดหมู่ ส่วนผสม และสูตรยาทั้งหมดในที่เดียว
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="gap-1.5 px-3 py-1.5">
              <i className="bx bx-category text-primary" />
              {categoryOrder.length} หมวดหมู่
            </Badge>
            <Badge variant="outline" className="gap-1.5 px-3 py-1.5">
              <i className="bx bx-leaf text-gold" />
              {ingredients.length} ส่วนผสม
            </Badge>
            <Badge variant="outline" className="gap-1.5 px-3 py-1.5">
              <i className="bx bx-flask text-primary" />
              {potions.length} สูตรยา
            </Badge>
          </div>
        </div>
        <Separator className="bg-border/60" />
      </header>

      <Tabs defaultValue="categories" className="space-y-6">
        <div className="-mx-1 overflow-x-auto border-b border-border/40 px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <TabsList className="h-auto w-fit min-w-full justify-start gap-0 bg-transparent p-0">
            {[
              { value: 'categories', icon: 'bx-category', label: 'หมวดหมู่' },
              { value: 'ingredients', icon: 'bx-leaf', label: 'ส่วนผสม' },
              { value: 'potions', icon: 'bx-flask', label: 'สูตรยา' },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className={cn(
                  'relative gap-2 rounded-none border-0 bg-transparent px-5 py-3 font-heading text-sm tracking-[0.08em] text-muted-foreground shadow-none transition-colors duration-200',
                  'hover:text-foreground',
                  'data-[state=active]:bg-transparent data-[state=active]:text-gold data-[state=active]:shadow-none',
                  'after:!absolute after:!inset-x-5 after:!bottom-[-1px] after:!h-[2px] after:!rounded-full after:!bg-gold after:!opacity-0 after:!transition-opacity after:!duration-300',
                  'data-[state=active]:after:!opacity-100'
                )}
              >
                <i className={cn('bx text-base', tab.icon)} />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="categories" className="animate-in fade-in duration-300">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="gap-0 overflow-hidden py-0">
              <CardHeader className="border-b border-border/50 bg-gold/5 px-6 py-5">
                <SectionHeader
                  icon="bx-plus-circle"
                  title="เพิ่มหมวดหมู่"
                  description="สร้างหมวดหมู่ใหม่สำหรับจัดกลุ่มสูตรยา"
                  accent="text-gold"
                />
              </CardHeader>
              <CardContent className="px-6 py-5">
                <div className="flex gap-2">
                  <Input
                    placeholder="ชื่อหมวดหมู่ใหม่"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addCategory()}
                    className="flex-1"
                  />
                  <Button type="button" onClick={addCategory} className="shrink-0">
                    <i className="bx bx-plus" />
                    เพิ่ม
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="gap-0 overflow-hidden py-0 lg:col-span-2">
              <CardHeader className="border-b border-border/50 px-6 py-5">
                <SectionHeader
                  icon="bx-category"
                  title="รายการหมวดหมู่"
                  description="ลากจัดลำดับด้วยปุ่มขึ้น/ลง"
                  count={categoryOrder.length}
                  accent="text-gold"
                />
              </CardHeader>
              <CardContent className="px-6 py-5">
                {categoryOrder.length === 0 ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">ยังไม่มีหมวดหมู่</p>
                ) : (
                  <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {categoryOrder.map((cat, idx) => {
                      const meta = getCategoryMeta(cat, idx);
                      return (
                        <DataRow
                          key={cat}
                          actions={
                            <>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                disabled={idx === 0}
                                onClick={() => moveCategory(idx, 'up')}
                                className="text-muted-foreground hover:text-gold"
                              >
                                <i className="bx bx-chevron-up" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                disabled={idx === categoryOrder.length - 1}
                                onClick={() => moveCategory(idx, 'down')}
                                className="text-muted-foreground hover:text-gold"
                              >
                                <i className="bx bx-chevron-down" />
                              </Button>
                              <ConfirmDialog
                                title="ลบหมวดหมู่"
                                description={`ต้องการลบหมวดหมู่ "${cat}" หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้`}
                                confirmLabel="ลบ"
                                destructive
                                onConfirm={() => removeCategory(cat)}
                                trigger={
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon-sm"
                                    className="text-destructive hover:text-destructive"
                                  >
                                    <i className="bx bx-trash" />
                                  </Button>
                                }
                              />
                            </>
                          }
                        >
                          <div className="flex items-center gap-3">
                            <span className={cn('flex size-8 items-center justify-center rounded-lg bg-muted/40', meta.accent)}>
                              <i className={cn('bx', meta.icon)} />
                            </span>
                            <span className="font-medium">{cat}</span>
                          </div>
                        </DataRow>
                      );
                    })}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ingredients" className="animate-in fade-in duration-300">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="gap-0 overflow-hidden py-0">
              <CardHeader className="border-b border-border/50 bg-gold/5 px-6 py-5">
                <SectionHeader
                  icon={editingIngredientId ? 'bx-edit' : 'bx-plus-circle'}
                  title={editingIngredientId ? 'แก้ไขส่วนผสม' : 'เพิ่มส่วนผสม'}
                  description="กำหนดชื่อและราคาของวัตถุดิบ"
                  accent="text-gold"
                />
              </CardHeader>
              <CardContent className="px-6 py-5">
                <form onSubmit={saveIngredient} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="ing-name">ชื่อส่วนผสม</Label>
                    <Input
                      id="ing-name"
                      placeholder="เช่น คราบงูบูมสแลง"
                      value={ingName}
                      onChange={(e) => setIngName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'galleon', label: 'Galleon', value: ingGalleon, set: setIngGalleon },
                      { id: 'sickle', label: 'Sickle', value: ingSickle, set: setIngSickle },
                      { id: 'knut', label: 'Knut', value: ingKnut, set: setIngKnut },
                    ].map(({ id, label, value, set }) => (
                      <div key={id} className="space-y-2">
                        <Label htmlFor={id}>{label}</Label>
                        <NumberSliderInput value={value} onChange={set} min={0} placeholder="0" />
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 pt-1">
                    <Button type="submit" className="flex-1">
                      <i className={cn('bx', editingIngredientId ? 'bx-save' : 'bx-plus')} />
                      {editingIngredientId ? 'บันทึกการแก้ไข' : 'เพิ่มส่วนผสม'}
                    </Button>
                    {editingIngredientId && (
                      <Button type="button" variant="outline" onClick={resetIngredientForm}>
                        ยกเลิก
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card className="gap-0 overflow-hidden py-0">
              <CardHeader className="border-b border-border/50 px-6 py-5">
                <SectionHeader
                  icon="bx-list-ul"
                  title="รายการส่วนผสม"
                  description="คลิกแก้ไขหรือลบรายการ"
                  count={ingredients.length}
                  accent="text-gold"
                />
              </CardHeader>
              <CardContent className="px-6 py-5">
                <ScrollArea className="h-[400px] pr-3">
                  <ul className="space-y-2">
                    {ingredients.map((ing) => (
                      <DataRow
                        key={ing.id}
                        highlight={editingIngredientId === ing.id}
                        actions={
                          <>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => handleEditIngredient(ing)}
                              className="text-gold"
                            >
                              <i className="bx bx-edit" />
                            </Button>
                            <ConfirmDialog
                              title="ลบส่วนผสม"
                              description={`ต้องการลบ "${ing.name}" หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้`}
                              confirmLabel="ลบ"
                              destructive
                              onConfirm={() => removeIngredient(ing.id)}
                              trigger={
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon-sm"
                                  className="text-destructive hover:text-destructive"
                                >
                                  <i className="bx bx-trash" />
                                </Button>
                              }
                            />
                          </>
                        }
                      >
                        <div>
                          <span className="font-medium">{ing.name}</span>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {ing.price.galleon}G {ing.price.sickle}S {ing.price.knut}K
                          </p>
                        </div>
                      </DataRow>
                    ))}
                  </ul>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="potions" className="animate-in fade-in duration-300">
          <div className="grid gap-6 xl:grid-cols-5">
            <Card className="gap-0 overflow-hidden py-0 xl:col-span-3">
              <CardHeader className="border-b border-border/50 bg-primary/5 px-6 py-5">
                <SectionHeader
                  icon={editingPotionId ? 'bx-edit' : 'bx-plus-circle'}
                  title={editingPotionId ? 'แก้ไขสูตรยา' : 'สร้างสูตรยาใหม่'}
                  description="กรอกรายละเอียดสูตร ส่วนผสม และขั้นตอนการปรุง"
                />
              </CardHeader>
              <CardContent className="px-6 py-5">
                <form onSubmit={addPotion} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="pot-name">ชื่อยา</Label>
                      <Input
                        id="pot-name"
                        placeholder="เช่น น้ำยาสรรพรส"
                        value={potName}
                        onChange={(e) => setPotName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pot-category">หมวดหมู่</Label>
                      <Input
                        id="pot-category"
                        placeholder="เช่น ขั้นสูง"
                        value={potCategory}
                        onChange={(e) => setPotCategory(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pot-image">รูปภาพ URL</Label>
                      <Input
                        id="pot-image"
                        placeholder="/assets/potion.png"
                        value={potImage}
                        onChange={(e) => setPotImage(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="rounded-xl border border-border/50 bg-muted/10 p-4">
                    <Label className="mb-3 block text-primary">ส่วนผสมที่ใช้</Label>
                    <div className="mb-3 flex flex-wrap items-end gap-2">
                      <div className="min-w-[160px] flex-1 space-y-2">
                        <Label className="text-xs text-muted-foreground">เลือกส่วนผสม</Label>
                        <Select value={tempIngId || undefined} onValueChange={setTempIngId}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="-- เลือก --" />
                          </SelectTrigger>
                          <SelectContent>
                            {ingredients.map((i) => (
                              <SelectItem key={i.id} value={i.id}>
                                {i.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">จำนวน</Label>
                        <NumberSliderInput
                          value={tempIngQty}
                          onChange={setTempIngQty}
                          min={0}
                          placeholder="0"
                          narrow
                        />
                      </div>
                      <Button type="button" variant="outline" onClick={addPotionIng} className="shrink-0">
                        <i className="bx bx-plus" />
                        เพิ่ม
                      </Button>
                    </div>
                    {potSelectedIngs.length > 0 && (
                      <ul className="space-y-1.5">
                        {potSelectedIngs.map((pi, idx) => {
                          const ing = ingredients.find((i) => i.id === pi.id);
                          return (
                            <li
                              key={idx}
                              className="flex items-center justify-between rounded-lg bg-background/40 px-3 py-2 text-sm"
                            >
                              <span>
                                {ing?.name} <span className="text-gold">x{pi.quantity}</span>
                              </span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => removePotionIng(idx)}
                                className="text-destructive hover:text-destructive"
                              >
                                <i className="bx bx-x" />
                              </Button>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pot-steps">ขั้นตอนการปรุง</Label>
                    <Textarea
                      id="pot-steps"
                      placeholder="บรรทัดละ 1 ขั้นตอน"
                      rows={6}
                      value={potSteps}
                      onChange={(e) => setPotSteps(e.target.value)}
                      required
                    />
                  </div>

                  <div className="flex gap-2 pt-1">
                    <Button type="submit" className="flex-1">
                      <i className={cn('bx', editingPotionId ? 'bx-save' : 'bx-plus')} />
                      {editingPotionId ? 'บันทึกการแก้ไข' : 'สร้างสูตรยา'}
                    </Button>
                    {editingPotionId && (
                      <Button type="button" variant="outline" onClick={cancelEditPotion}>
                        ยกเลิก
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card className="gap-0 overflow-hidden py-0 xl:col-span-2">
              <CardHeader className="border-b border-border/50 px-6 py-5">
                <SectionHeader
                  icon="bx-book-bookmark"
                  title="รายการสูตรยา"
                  description="สูตรยาทั้งหมดในระบบ"
                  count={potions.length}
                />
              </CardHeader>
              <CardContent className="px-6 py-5">
                <ScrollArea className="h-[560px] pr-3">
                  <ul className="space-y-2">
                    {potions.map((pot) => (
                      <DataRow
                        key={pot.id}
                        highlight={editingPotionId === pot.id}
                        actions={
                          <>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => handleEditPotion(pot)}
                              className="text-gold"
                            >
                              <i className="bx bx-edit" />
                            </Button>
                            <ConfirmDialog
                              title="ลบสูตรยา"
                              description={`ต้องการลบสูตรยา "${pot.name}" หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้`}
                              confirmLabel="ลบ"
                              destructive
                              onConfirm={() => removePotion(pot.id)}
                              trigger={
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon-sm"
                                  className="text-destructive hover:text-destructive"
                                >
                                  <i className="bx bx-trash" />
                                </Button>
                              }
                            />
                          </>
                        }
                      >
                        <div>
                          <span className="font-medium">{pot.name}</span>
                          <p className="mt-0.5 text-xs text-muted-foreground">{pot.category}</p>
                        </div>
                      </DataRow>
                    ))}
                  </ul>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
