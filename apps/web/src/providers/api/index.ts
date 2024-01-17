import { RawApiClient } from "@starter/api-tools";
import { RawLocalClient } from "@starter/web/providers/api/localClient";
import { useToast } from "@starter/ui/src/components/use-toast";
import { useRouter } from "next/navigation";

export const useLocalApiClient = () => {
  const { toast } = useToast();
  const router = useRouter();

  const createProxy = <T extends object>(target: T): T => {
    const handler: ProxyHandler<T> = {
      get: function (obj, prop) {
        const value = obj[prop as keyof T];
        if (typeof value === "function") {
          return async function (...args: any[]) {
            const result = await value.apply(obj, args);

            if (result.ok === false) {
              // handle redirect
              if (result.status === 302) {
                router.push(result.redirect);
              }

              // OR handle error
              else {
                toast({
                  title: "Unkown error occurred",
                  duration: 1000,
                  variant: "destructive",
                });
              }
            }

            return result;
          };
        } else if (typeof value === "object" && value !== null) {
          return createProxy(value); // Recursively create a proxy for nested objects
        } else {
          return value;
        }
      },
    };

    return new Proxy(target, handler);
  };

  return createProxy<typeof RawLocalClient>(RawLocalClient);
};

export const useApiClient = () => {
  const { toast } = useToast();
  const router = useRouter();

  const createProxy = <T extends object>(target: T): T => {
    const handler: ProxyHandler<T> = {
      get: function (obj, prop) {
        const value = obj[prop as keyof T];
        if (typeof value === "function") {
          return async function (...args: any[]) {
            const result = await value.apply(obj, args);

            if (result.ok === false) {
              // handle redirect
              if (result.status === 302) {
                router.push(result.redirect);
              }

              // OR handle error
              else {
                toast({
                  title: result.title,
                  description: result.message,
                  duration: 1000,
                  variant: "destructive",
                });
              }
            }

            return result;
          };
        } else if (typeof value === "object" && value !== null) {
          return createProxy(value); // Recursively create a proxy for nested objects
        } else {
          return value;
        }
      },
    };

    return new Proxy(target, handler);
  };

  return createProxy<typeof RawApiClient>(RawApiClient);
};
