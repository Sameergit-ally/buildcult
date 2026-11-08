import { Marquee } from "./marquee";
import { motion } from "motion/react";

export interface BrandList {
  image: string;
  name: string;
  lightimg: string;
}

export function BrandSlider({ brandList }: { brandList: BrandList[] }) {
  return (
    <section className="w-full overflow-hidden">
      <div className="py-6 md:py-10">
        <div className="mx-auto max-w-6xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.4, ease: "easeInOut" }}
            className="flex flex-col gap-3"
          >
            <div className="flex justify-center text-center py-3 md:py-4 relative">
              <div className="flex items-center justify-center gap-4">
                <div className="hidden md:block h-px w-36 bg-gradient-to-l from-foreground/20 to-transparent" />
                <p className="text-sm font-medium tracking-wide sm:px-2 px-6 glass-subtext text-center">
                  Builders and partners from leading communities and ecosystems worldwide
                </p>
                <div className="hidden md:block h-px w-36 bg-gradient-to-r from-foreground/20 to-transparent" />
              </div>
            </div>
            {brandList && brandList.length > 0 && (
              <div className="py-4">
                <Marquee pauseOnHover className="[--duration:25s] p-0">
                  {brandList.map((brand, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-center grayscale opacity-75 hover:grayscale-0 hover:opacity-100 transition-all duration-300 px-4"
                    >
                      <img
                        src={brand.image}
                        alt={brand.name}
                        className="h-8 max-w-[140px] object-contain dark:hidden"
                      />
                      <img
                        src={brand.lightimg || brand.image}
                        alt={brand.name}
                        className="hidden dark:block h-8 max-w-[140px] object-contain"
                      />
                    </div>
                  ))}
                </Marquee>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default BrandSlider;

