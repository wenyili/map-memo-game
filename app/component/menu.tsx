import { cn } from "@/app/lib/utils"
import { Dialog, DialogContent, DialogTitle, DialogTrigger, DialogClose } from "@/app/ui/dialog"
import { Button } from "../ui/button"
import { IconMenu } from "../ui/icons"
import { Switch } from '../ui/switch';
import { RadioGroup, RadioGroupIndicator, RadioGroupItem } from '../ui/radio'
import { useEffect, useState } from "react";

interface VoiceDetectorProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean, result?: string) => void
}

export function Menu ({
  isOpen,
  onOpenChange
}: VoiceDetectorProps) {
    const [useGPT, setUseGPT] = useState(false)
    const [recorderType, setRecorderType] = useState("rtasr")

    useEffect(() => {
        setUseGPT(localStorage.getItem("useGPT") === "true")
        setRecorderType(localStorage.getItem("recorderType") ?? "rtasr")
    }, [])

    return (
        <Dialog open={isOpen} onOpenChange={(isOpen) => {
                onOpenChange(isOpen)
            }
        }>
            <DialogTrigger asChild>
                <Button
                    className="fixed top-0 right-0 m-6 p-2 bg-gray-200 hover:bg-gray-500 text-gray-800 font-bold">
                    <IconMenu/>
                </Button>
            </DialogTrigger>
            <DialogContent className={cn(
                "bg-white"
            )}>
                <DialogTitle className="mb-4">Setting</DialogTitle>
                <fieldset className="flex gap-5 items-center">
                    <label className="text-right w-24 font-bold text-foreground/80" htmlFor="name">
                        GPT
                    </label>
                    <Switch defaultChecked={useGPT} onCheckedChange={checked => {
                        checked ? localStorage.setItem("useGPT", "true") : localStorage.setItem("useGPT", "false")
                        setUseGPT(checked)
                    }}/>
                </fieldset>
                <fieldset className="flex gap-5 items-center">
                    <label className="text-right w-24 font-bold text-foreground/80" htmlFor="username">
                        语音类型
                    </label>
                    <RadioGroup name="recorderType" defaultValue={recorderType} onValueChange={value => {
                        localStorage.setItem("recorderType", value)
                        setRecorderType(value)
                    }}>
                        <RadioGroupItem value="rtasr">
                            <RadioGroupIndicator/>
                        </RadioGroupItem>
                        <label className="w-24" htmlFor="r2">
                            语音转写
                        </label>
                        <RadioGroupItem value="iat">
                            <RadioGroupIndicator/>
                        </RadioGroupItem>
                        <label className="w-24" htmlFor="r2">
                            语音听写
                        </label>
                    </RadioGroup>
                </fieldset>
            </DialogContent>
        </Dialog>
    )
}
    