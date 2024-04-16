"use client";
import { useEditor } from "@/app/providers/web-editor/editorProvider";
import GradientText from "@/components/golbal/GradientText";
import ToolTip from "@/components/golbal/ToolTip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabList } from "@tremor/react";
import {
  AlignHorizontalDistributeStart,
  AlignHorizontalJustifyCenterIcon,
  AlignHorizontalJustifyEnd,
  AlignHorizontalJustifyEndIcon,
  AlignHorizontalJustifyStart,
  AlignHorizontalSpaceAroundIcon,
  AlignHorizontalSpaceBetween,
  LucideAlignHorizontalDistributeStart,
} from "lucide-react";
import { useState } from "react";
type Props = {};

const SettingsTab = (props: Props) => {
  const { state, dispatch } = useEditor();

  const handleChange = (e: any) => {
    const setPropertyById = e.target.id;

    const styleObj = {
      [setPropertyById]: e.target.value,
    };
    dispatch({
      type: "UPDATE_ELEMENT",
      payload: {
        elementDetails: {
          ...state.editor.selectedElement,
          content: {
            ...state.editor.selectedElement.content,
            ...styleObj,
          },
        },
      },
    });
  };

  const handleOnChange = (e: any) => {
    const setPropertyById = e.target.id;

    const styleObj = {
      [setPropertyById]: e.target.value.replace(";", ""),
    };

    dispatch({
      type: "UPDATE_ELEMENT",
      payload: {
        elementDetails: {
          ...state.editor.selectedElement,
          styles: { ...state.editor.selectedElement.styles, ...styleObj },
        },
      },
    });
  };
  return (
    <Accordion type="multiple" className="w-full">
      {/* Typography */}
      <AccordionItem value="Typography" className="px-6 py-0 border-y-[1px]">
        <AccordionTrigger className="!no-underline">
          <GradientText from="red" to="blue">
            {" "}
            Typography
          </GradientText>
        </AccordionTrigger>
        <AccordionContent>
          <div className="flex flex-col gap-2 mb-2">
            <p className="text-muted-foreground">Font Family</p>
            <Input
              id="fontFamily"
              placeholder="font-family"
              onChange={handleOnChange}
              value={state.editor.selectedElement.styles.fontFamily}
            />
          </div>
          <div className="flex flex-col gap-2 mb-2">
            <p className="text-muted-foreground">Font Size</p>
            <Input
              id="fontSize"
              placeholder="rem/em/px"
              onChange={handleOnChange}
              value={state.editor.selectedElement.styles.fontSize}
            />
          </div>
          <div className="flex flex-col gap-2 mb-2">
            <p className="text-muted-foreground">Font Weight</p>
            <Input
              id="fontWeight"
              placeholder="rem/em/px"
              onChange={handleOnChange}
              value={state.editor.selectedElement.styles.fontWeight}
            />
          </div>
          <div className="flex flex-col gap-2 mb-2">
            <p className="text-muted-foreground">Line Height</p>
            <Input
              id="lineHeight"
              placeholder="line-height"
              onChange={handleOnChange}
              value={state.editor.selectedElement.styles.lineHeight}
            />
          </div>
          <div className="flex flex-col gap-2 mb-2">
            <p className="text-muted-foreground">Letter Spacing</p>
            <Input
              id="letterSpacing"
              placeholder="letter-spacing"
              onChange={handleOnChange}
              value={state.editor.selectedElement.styles.letterSpacing}
            />
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Dimensions */}
      <AccordionItem value="Dimensions" className="px-6 py-0 border-y-[1px]">
        <AccordionTrigger className="!no-underline">
          <GradientText from="red" to="blue">
            {" "}
            Dimensions
          </GradientText>
        </AccordionTrigger>
        <AccordionContent>
          <div className="flex flex-col gap-2 mb-2">
            <p className="text-muted-foreground">Width</p>
            <Input
              id="width"
              placeholder="rem/em/px/%/vw"
              onChange={handleOnChange}
              value={state.editor.selectedElement.styles.width}
            />
          </div>
          <div className="flex flex-col gap-2 mb-2">
            <p className="text-muted-foreground">Height</p>
            <Input
              id="height"
              placeholder="rem/em/px/%/vh"
              onChange={handleOnChange}
              value={state.editor.selectedElement.styles.height}
            />
          </div>
          <div className="flex  gap-2 mb-2 justify-between">
            <div className="flex flex-col gap-2 mb-2">
              <p className="text-muted-foreground">Padding</p>
              <Input
                id="padding"
                placeholder="rem/em/px/%/vh"
                onChange={handleOnChange}
                value={state.editor.selectedElement.styles.padding}
              />
            </div>
            <div className="flex flex-col gap-2 mb-2">
              <p className="text-muted-foreground">Margin</p>
              <Input
                id="margin"
                placeholder="rem/em/px/%/vh"
                onChange={handleOnChange}
                value={state.editor.selectedElement.styles.margin}
              />
            </div>
          </div>
          <GradientText from="red" to="blue" size="25px">
            {" "}
            Padding
          </GradientText>

          <div className="p-4">
            <div className="flex  gap-2 mb-2 justify-between">
              <div className="flex flex-col gap-2 mb-2">
                <p className="text-muted-foreground">Padding Top</p>
                <Input
                  id="paddingTop"
                  placeholder="rem/em/px/%/vh"
                  onChange={handleOnChange}
                  value={state.editor.selectedElement.styles.paddingTop}
                />
              </div>
              <div className="flex flex-col gap-2 mb-2">
                <p className="text-muted-foreground">Padding Bottom</p>
                <Input
                  id="paddingBottom"
                  placeholder="rem/em/px/%/vh"
                  onChange={handleOnChange}
                  value={state.editor.selectedElement.styles.paddingBottom}
                />
              </div>
            </div>

            <div className="flex  gap-2 mb-2 justify-between">
              <div className="flex flex-col gap-2 mb-2">
                <p className="text-muted-foreground">Padding Left</p>
                <Input
                  id="paddingLeft"
                  placeholder="rem/em/px/%/vh"
                  onChange={handleOnChange}
                  value={state.editor.selectedElement.styles.paddingLeft}
                />
              </div>
              <div className="flex flex-col gap-2 mb-2">
                <p className="text-muted-foreground">Padding Right</p>
                <Input
                  id="paddingRight"
                  placeholder="rem/em/px/%/vh"
                  onChange={handleOnChange}
                  value={state.editor.selectedElement.styles.paddingRight}
                />
              </div>
            </div>
          </div>
          <p className="text-muted-foreground text-xl">
            <GradientText from="red" to="blue" size="25px">
              {" "}
              Margin
            </GradientText>
          </p>
          <div className="p-4">
            <div className="flex  gap-2 mb-2 justify-between">
              <div className="flex flex-col gap-2 mb-2">
                <p className="text-muted-foreground">Margin Top</p>
                <Input
                  id="marginTop"
                  placeholder="rem/em/px/%/vh"
                  onChange={handleOnChange}
                  value={state.editor.selectedElement.styles.marginTop}
                />
              </div>
              <div className="flex flex-col gap-2 mb-2">
                <p className="text-muted-foreground">Margin Bottom</p>
                <Input
                  id="marginBottom"
                  placeholder="rem/em/px/%/vh"
                  onChange={handleOnChange}
                  value={state.editor.selectedElement.styles.marginBottom}
                />
              </div>
            </div>

            <div className="flex  gap-2 mb-2 justify-between">
              <div className="flex flex-col gap-2 mb-2">
                <p className="text-muted-foreground">Margin Left</p>
                <Input
                  id="marginLeft"
                  placeholder="rem/em/px/%/vh"
                  onChange={handleOnChange}
                  value={state.editor.selectedElement.styles.marginLeft}
                />
              </div>
              <div className="flex flex-col gap-2 mb-2">
                <p className="text-muted-foreground">Margin Right</p>
                <Input
                  id="marginRight"
                  placeholder="rem/em/px/%/vh"
                  onChange={handleOnChange}
                  value={state.editor.selectedElement.styles.marginRight}
                />
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Colors */}
      <AccordionItem value="Colors" className="px-6 py-0  border-y-[1px]">
        <AccordionTrigger className="!no-underline">
          {" "}
          <GradientText from="red" to="blue">
            {" "}
            Colors / Images
          </GradientText>
        </AccordionTrigger>
        <AccordionContent>
          <p className="text-muted-foreground w-[79%] mb-2">Background Color</p>
          <div className="flex gap-2">
            <div
              className="w-[20%] rounded-md border-dashed border-[1px] border-x-purple-950"
              style={{
                backgroundColor:
                  state.editor.selectedElement.styles.backgroundColor,
              }}
            />
            <Input
              id="backgroundColor"
              placeholder="colors name..."
              onChange={handleOnChange}
              value={state.editor.selectedElement.styles.backgroundColor}
            />
          </div>
          <p className="text-muted-foreground w-[79%] mb-2 mt-2">Color</p>
          <div className="flex gap-2">
            <div className="w-[20%] rounded-md border-dashed flex items-center justify-center bg-gray-900 p-2 font-bold">
              <p style={{ color: state.editor.selectedElement.styles.color }}>
                Grow
              </p>
            </div>
            <Input
              id="color"
              placeholder="colors name..."
              onChange={handleOnChange}
              value={state.editor.selectedElement.styles.color}
            />
          </div>
          <p className="text-muted-foreground w-[79%] mb-2 mt-2">
            Background Image
          </p>
          <div className="flex gap-2">
            <div
              className="w-[20%] rounded-md border-[1px] border-dashed border-x-purple-950"
              style={{
                backgroundImage:
                  state.editor.selectedElement.styles.backgroundImage,
              }}
            />
            <Input
              id="backgroundImage"
              placeholder="url()/linear gradient $ more."
              onChange={handleOnChange}
              value={state.editor.selectedElement.styles.backgroundImage}
            />
          </div>
        </AccordionContent>
      </AccordionItem>
      {/* Design */}
      <AccordionItem value="Design" className="px-6 py-0 border-y-[1px]">
        <AccordionTrigger className="!no-underline">
          {" "}
          <GradientText from="red" to="blue">
            {" "}
            Design
          </GradientText>
        </AccordionTrigger>
        <AccordionContent>
          <div>
            <Label className="text-muted-foreground">Border Radius</Label>
            <div className="flex items-center justify-end">
              <small className="">
                {typeof state.editor.selectedElement.styles?.borderRadius ===
                "number"
                  ? state.editor.selectedElement.styles?.borderRadius
                  : parseFloat(
                      (
                        state.editor.selectedElement.styles?.borderRadius || "0"
                      ).replace("px", "")
                    ) || 0}
                px
              </small>
            </div>
            <Slider
              onValueChange={(e) => {
                handleOnChange({
                  target: {
                    id: "borderRadius",
                    value: `${e[0]}px`,
                  },
                });
              }}
              defaultValue={[
                typeof state.editor.selectedElement.styles?.borderRadius ===
                "number"
                  ? state.editor.selectedElement.styles?.borderRadius
                  : parseFloat(
                      (
                        state.editor.selectedElement.styles?.borderRadius || "0"
                      ).replace("%", "")
                    ) || 0,
              ]}
              max={100}
              step={1}
            />
          </div>
          <div className="mt-3">
            <Label className="text-muted-foreground">Opacity</Label>
            <div className="flex items-center justify-end">
              <small className="">
                {typeof state.editor.selectedElement.styles?.opacity ===
                "number"
                  ? state.editor.selectedElement.styles?.opacity
                  : parseFloat(
                      (
                        state.editor.selectedElement.styles?.opacity || "0"
                      ).replace("%", "")
                    ) || 0}
                %
              </small>
            </div>
            <Slider
              onValueChange={(e) => {
                handleOnChange({
                  target: {
                    id: "opacity",
                    value: `${e[0]}%`,
                  },
                });
              }}
              defaultValue={[
                typeof state.editor.selectedElement.styles?.opacity === "number"
                  ? state.editor.selectedElement.styles?.opacity
                  : parseFloat(
                      (
                        state.editor.selectedElement.styles?.opacity || "0"
                      ).replace("%", "")
                    ) || 0,
              ]}
              max={100}
              step={1}
            />
          </div>
        </AccordionContent>
      </AccordionItem>
      {/* Flex Box */}
      <AccordionItem value="Flexbox" className="px-6 py-0">
        <AccordionTrigger className="!no-underline">
          {" "}
          <GradientText from="red" to="blue">
            {" "}
            Flex Box
          </GradientText>
        </AccordionTrigger>

        <AccordionContent>
          <div>
            <Label className="text-muted-foreground mb-6"> Justify Content</Label>
            <Tabs
              onValueChange={(e) =>
                handleOnChange({
                  target: {
                    id: "justifyContent",
                    value: e,
                  },
                })
              }
              value={state.editor.selectedElement.styles.justifyContent}
            >
              <TabsList className="flex items-center flex-row justify-between border-[1px] rounded-md bg-transparent h-fit gap-4">
                <TabsTrigger
                  value="space-between"
                  className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                >
                  <ToolTip text="space-between">
                    <AlignHorizontalSpaceBetween size={18} />
                  </ToolTip>
                </TabsTrigger>
                <TabsTrigger
                  value="space-evenly"
                  className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                >
                  <ToolTip text="space-evenly">
                    <AlignHorizontalSpaceAroundIcon size={18} />
                  </ToolTip>
                </TabsTrigger>
                <TabsTrigger
                  value="center"
                  className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                >
                  <ToolTip text="center">
                    <AlignHorizontalJustifyCenterIcon size={18} />
                  </ToolTip>
                </TabsTrigger>
                <TabsTrigger
                  value="start"
                  className="w-10 h-10 p-0 data-[state=active]:bg-muted "
                >
                  <ToolTip text="start">
                    <AlignHorizontalJustifyStart size={18} />
                  </ToolTip>
                </TabsTrigger>
                <TabsTrigger
                  value="end"
                  className="w-10 h-10 p-0 data-[state=active]:bg-muted "
                >
                  <ToolTip text="end">
                    <AlignHorizontalJustifyEndIcon size={18} />
                  </ToolTip>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="mt-3">
            <Label className="text-muted-foreground mb-6"> Align items</Label>
            <Tabs
              onValueChange={(e) =>
                handleOnChange({
                  target: {
                    id: "alignItems",
                    value: e,
                  },
                })
              }
              value={state.editor.selectedElement.styles.alignItems}
            >
              <TabsList className="flex items-center flex-row justify-between border-[1px] rounded-md bg-transparent h-fit gap-4">
                <TabsTrigger
                  value="start"
                  className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                >
                  <ToolTip text="start">
                    <AlignHorizontalJustifyStart size={18} />
                  </ToolTip>
                </TabsTrigger>
                <TabsTrigger
                  value="center"
                  className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                >
                  <ToolTip text="center">
                    <AlignHorizontalJustifyCenterIcon size={18} />
                  </ToolTip>
                </TabsTrigger>
                <TabsTrigger
                  value="strech"
                  className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                >
                  <ToolTip text="strech">
                    <LucideAlignHorizontalDistributeStart size={18} />
                  </ToolTip>
                </TabsTrigger>
                <TabsTrigger
                  value="end"
                  className="w-10 h-10 p-0 data-[state=active]:bg-muted "
                >
                  <ToolTip text="end">
                    <AlignHorizontalJustifyEnd size={18} />
                  </ToolTip>
                </TabsTrigger>
              
              </TabsList>
            </Tabs>
          </div>
        </AccordionContent>
      </AccordionItem>
      {/* Custom */}
      <AccordionItem value="Custom" className="px-6 py-0">
        <AccordionTrigger className="!no-underline">
          {" "}
          <GradientText from="red" to="blue">
            {" "}
            Custom
          </GradientText>
        </AccordionTrigger>
        <AccordionContent>
          {state.editor.selectedElement.type === "link" &&
            !Array.isArray(state.editor.selectedElement.content) && (
              <div className="flex flex-col gap-2">
                <p className="text-muted-foreground">Link Path</p>
                <Input
                  id="href"
                  placeholder="https://domain.example.com/path"
                  onChange={handleChange}
                  value={state.editor.selectedElement.content.href}
                />
              </div>
            )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default SettingsTab;
