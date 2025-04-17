"use client";

import { Provider } from "react-redux";
import { store } from "./store";
import { usePathname, useRouter } from "next/navigation";
// import "mantine-datatable/styles.layer.css";

export function Providers({ children }: { children: React.ReactNode }) {

  return (
    <Provider store={store}>
      <div >
        {children}
      </div>
    </Provider>
  );
}
