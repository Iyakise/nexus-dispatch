"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function FormDemo() {
  const [checked, setChecked] = useState<boolean | "indeterminate">(true);
  return (
    <div className="grid gap-space-lg sm:grid-cols-2 lg:grid-cols-3">
      <div className="space-y-space-xs">
        <Label htmlFor="ds-default">Default</Label>
        <Input id="ds-default" placeholder="Search shipment, reefer or VIN" />
      </div>
      <div className="space-y-space-xs">
        <Label htmlFor="ds-value">With value</Label>
        <Input id="ds-value" defaultValue="NX-8921" className="font-mono text-telemetry-md" />
      </div>
      <div className="space-y-space-xs">
        <Label htmlFor="ds-disabled">Disabled</Label>
        <Input id="ds-disabled" placeholder="Unavailable" disabled />
      </div>
      <div className="space-y-space-xs">
        <Label htmlFor="ds-invalid">Invalid</Label>
        <Input id="ds-invalid" defaultValue="9.5" aria-invalid="true" aria-describedby="ds-invalid-msg" className="font-mono" />
        <p id="ds-invalid-msg" className="text-body-sm text-thermal-excursion-text">
          Setpoint must be between 2°C and 8°C.
        </p>
      </div>
      <div className="space-y-space-xs">
        <Label htmlFor="ds-select">Select</Label>
        <Select defaultValue="standard">
          <SelectTrigger id="ds-select">
            <SelectValue placeholder="Thermal profile" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="standard">2–8 °C (biologics)</SelectItem>
            <SelectItem value="crt">15–25 °C (room temp.)</SelectItem>
            <SelectItem value="frozen">−25 to −15 °C (frozen)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-space-sm pt-space-lg">
        <div className="flex items-center gap-space-sm">
          <Checkbox id="ds-cb1" checked={checked} onCheckedChange={setChecked} />
          <Label htmlFor="ds-cb1" className="text-body-md text-on-surface">
            Notify on thermal excursion
          </Label>
        </div>
        <div className="flex items-center gap-space-sm">
          <Checkbox id="ds-cb2" />
          <Label htmlFor="ds-cb2" className="text-body-md text-on-surface">
            Include driver on alert
          </Label>
        </div>
      </div>
    </div>
  );
}

export function OverlayDemo() {
  return (
    <TooltipProvider delayDuration={150}>
      <div className="flex flex-wrap items-center gap-space-md">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="secondary">Open dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Override reefer setpoint?</DialogTitle>
              <DialogDescription>
                Unit RF-2207 will move to 4.0°C. The change is logged against your account.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary">Cancel</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button variant="destructive" onClick={() => toast.error("Setpoint override sent to RF-2207")}>
                  Override setpoint
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="secondary">Side sheet</Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Fleet analytics</SheetTitle>
              <SheetDescription>Collapsed into a sliding sheet on laptop-width screens.</SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="secondary">Bottom sheet</Button>
          </SheetTrigger>
          <SheetContent side="bottom">
            <SheetHeader>
              <SheetTitle>Thermal alert</SheetTitle>
              <SheetDescription>Alerts open as a bottom sheet on tablets and handhelds.</SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary">
              Row actions
              <Icon name="expand_more" size={18} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>Shipment NX-8921</DropdownMenuLabel>
            <DropdownMenuItem>
              <Icon name="map" size={18} /> View on map
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Icon name="download" size={18} /> Export log
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem destructive>
              <Icon name="cancel" size={18} /> Cancel shipment
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Sensor info">
              <Icon name="sensors" size={20} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Probe A · last ping 12s ago</TooltipContent>
        </Tooltip>

        <Button variant="secondary" onClick={() => toast.success("Route NX-8921 dispatched")}>
          Success toast
        </Button>
        <Button variant="secondary" onClick={() => toast.error("Excursion on NX-8899", { description: "9.1°C, above the 8°C limit" })}>
          Error toast
        </Button>
      </div>
    </TooltipProvider>
  );
}

export function TabsDemo() {
  return (
    <Tabs defaultValue="thermal">
      <TabsList>
        <TabsTrigger value="thermal">Thermal profile</TabsTrigger>
        <TabsTrigger value="route">Route</TabsTrigger>
        <TabsTrigger value="audit">Audit trail</TabsTrigger>
      </TabsList>
      <TabsContent value="thermal" className="text-body-md text-on-surface-variant">
        6-hour thermal profile for the selected shipment.
      </TabsContent>
      <TabsContent value="route" className="text-body-md text-on-surface-variant">
        Planned versus actual route.
      </TabsContent>
      <TabsContent value="audit" className="text-body-md text-on-surface-variant">
        Immutable event log.
      </TabsContent>
    </Tabs>
  );
}
