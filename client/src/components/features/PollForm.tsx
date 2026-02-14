"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPollSchema, type CreatePollFormData } from "@/lib/validation";
import type { CreatePollRequest } from "@/types/api";
import { Plus, Trash2 } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";

interface PollFormProps {
  onSubmit: (data: CreatePollRequest) => Promise<void>;
  isLoading?: boolean;
}

export function PollForm({ onSubmit, isLoading = false }: PollFormProps) {
  const form = useForm<CreatePollFormData>({
    resolver: zodResolver(createPollSchema),
    defaultValues: {
      question: "",
      options: ["", ""],
    },
  });

  const options = useWatch({ control: form.control, name: "options" });

  const handleAddOption = (): void => {
    if (options.length < 10) {
      form.setValue("options", [...options, ""]);
    }
  };

  const handleRemoveOption = (index: number): void => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      form.setValue("options", newOptions);
    }
  };

  const handleSubmit = async (values: CreatePollFormData): Promise<void> => {
    const filteredOptions = values.options.filter((opt) => opt.trim() !== "");
    console.log("Submitting poll with data:", {
      question: values.question,
      options: filteredOptions,
    });
    await onSubmit({
      question: values.question,
      options: filteredOptions,
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="question"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-navy font-semibold">
                  Poll Question
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="What would you like to ask?"
                    {...field}
                    disabled={isLoading}
                    className="border-gray-300 focus:border-vibrant-red focus:ring-vibrant-red"
                  />
                </FormControl>
                <FormMessage className="text-left" />
              </FormItem>
            )}
          />

          <div className="space-y-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-semibold text-navy">Options</span>
              <span className="text-sm text-gray-600">
                ({options.length}/10)
              </span>
            </div>
            {options.map((_, index) => (
              <FormField
                key={index}
                control={form.control}
                name={`options.${index}` as const}
                render={({ field }) => (
                  <FormItem>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input
                          placeholder={`Option ${index + 1}`}
                          {...field}
                          disabled={isLoading}
                          className="flex-1 border-gray-300 focus:border-vibrant-red focus:ring-vibrant-red"
                          aria-label={`Option ${index + 1}`}
                        />
                      </FormControl>
                      {options.length > 2 && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleRemoveOption(index)}
                          disabled={isLoading}
                          className="shrink-0 h-12 hover:text-vibrant-red border-vibrant-red/30 text-vibrant-red/70 hover:bg-light-red/50"
                          aria-label={`Remove option ${index + 1}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <FormMessage className="text-left" />
                  </FormItem>
                )}
              />
            ))}
          </div>

          <div className="flex gap-3 mt-10">
            <Button
              type="button"
              variant="outline"
              onClick={handleAddOption}
              disabled={isLoading || options.length >= 10}
              className="flex rounded-none items-center gap-2 border-vibrant-red text-vibrant-red hover:text-vibrant-red hover:bg-light-red/30 h-12"
            >
              <Plus className="h-4 w-4" />
              Add Option
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-vibrant-red text-white h-12 text-sm font-bold uppercase tracking-widest hover:bg-vibrant-red/90 transition-all rounded-none border border-vibrant-red"
            >
              {isLoading ? "Creating..." : "Create Poll"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
