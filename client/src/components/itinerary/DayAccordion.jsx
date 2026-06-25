import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import ActivityItem from './ActivityItem';
import { fmtDate } from '@/utils/formatDate';

const DayAccordion = ({ days, defaultOpenDay = '1' }) => (
  <Accordion type="multiple" defaultValue={[defaultOpenDay]} className="space-y-2">
    {days.map((day) => (
      <AccordionItem
        key={day.dayNumber}
        value={String(day.dayNumber)}
        className="rounded-xl border bg-card px-4 shadow-sm"
      >
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
              {day.dayNumber}
            </div>
            <div className="text-left">
              <p className="font-semibold">{day.theme || `Day ${day.dayNumber}`}</p>
              {day.date && (
                <p className="text-xs text-muted-foreground">{fmtDate(day.date, 'EEEE, MMMM d')}</p>
              )}
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="pt-2">
            {day.activities?.map((activity, i) => (
              <ActivityItem
                key={i}
                activity={activity}
                isLast={i === day.activities.length - 1}
              />
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    ))}
  </Accordion>
);

export default DayAccordion;
