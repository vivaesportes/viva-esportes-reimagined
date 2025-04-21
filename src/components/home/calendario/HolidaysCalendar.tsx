
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { CalendarCheck } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const holidays = [
  { date: new Date(2025, 0, 1), name: "Confraternização Universal" },
  { date: new Date(2025, 1, 15), name: "Carnaval" },
  { date: new Date(2025, 1, 16), name: "Carnaval" },
  { date: new Date(2025, 3, 7), name: "Sexta-feira Santa" },
  { date: new Date(2025, 3, 21), name: "Tiradentes" },
  { date: new Date(2025, 4, 1), name: "Dia do Trabalho" },
  { date: new Date(2025, 5, 8), name: "Corpus Christi" },
  { date: new Date(2025, 8, 7), name: "Independência do Brasil" },
  { date: new Date(2025, 9, 12), name: "Nossa Senhora Aparecida" },
  { date: new Date(2025, 10, 2), name: "Finados" },
  { date: new Date(2025, 10, 15), name: "Proclamação da República" },
  // Recesso de fim de ano
  ...Array.from({ length: 14 }, (_, i) => ({
    date: new Date(2025, 11, 20 + i),
    name: "Recesso de Fim de Ano",
  })),
];

export function HolidaysCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  function isHoliday(date: Date) {
    return holidays.some(
      (holiday) =>
        holiday.date.getDate() === date.getDate() &&
        holiday.date.getMonth() === date.getMonth()
    );
  }

  function getHolidayName(date: Date) {
    return holidays.find(
      (holiday) =>
        holiday.date.getDate() === date.getDate() &&
        holiday.date.getMonth() === date.getMonth()
    )?.name;
  }

  return (
    <section className="py-20 bg-white" id="calendario">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Calendário de <span className="text-viva-yellow">Feriados</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Confira nossos feriados e recessos para o ano de 2025
          </p>
        </div>

        <div className="flex flex-col items-center justify-center space-y-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[280px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarCheck className="mr-2 h-4 w-4" />
                {date && isHoliday(date) ? (
                  <span className="text-viva-red font-medium">
                    {getHolidayName(date)}
                  </span>
                ) : (
                  "Selecione uma data"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                modifiers={{
                  holiday: (date) => isHoliday(date),
                }}
                modifiersStyles={{
                  holiday: { backgroundColor: "#E83A45", color: "white" },
                }}
                className="rounded-md border pointer-events-auto"
              />
            </PopoverContent>
          </Popover>

          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
            <h3 className="text-xl font-bold mb-4">Lista de Feriados 2025</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {holidays
                .filter(
                  (holiday, index, self) =>
                    index ===
                    self.findIndex(
                      (h) =>
                        h.date.getTime() === holiday.date.getTime() &&
                        h.name === holiday.name
                    )
                )
                .map((holiday, index) => (
                  <div
                    key={index}
                    className="flex items-center p-2 bg-gray-50 rounded"
                  >
                    <CalendarCheck className="h-4 w-4 text-viva-red mr-2" />
                    <span className="text-sm">
                      {holiday.date.toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                      })}{" "}
                      - {holiday.name}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
