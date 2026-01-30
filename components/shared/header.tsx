import { Plane } from "lucide-react";
import { Button } from "../ui/button";

const Header = () => {
  return (
    <header className="bg-white dark:bg-gray-900 border-b border-border/40 sticky top-0 z-20">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 text-white">
              <Plane className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              SpotFly
            </h1>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            <Button className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
              Sign In
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
