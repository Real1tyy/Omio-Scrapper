{
  description = "{{ project_name }} webscrapper";

  inputs = {
    nixpkgs.url =
      "github:NixOS/nixpkgs/nixos-unstable"; # Pin for reproducibility
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let pkgs = import nixpkgs { inherit system; };
      in {
        devShells.default = pkgs.mkShell {
          buildInputs = [
            # Node.js and package managers
            pkgs.nodejs
            pkgs.pnpm
            pkgs.bun
          ];

          # Environment setup
          shellHook = ''
            echo "Node.js version: $(node -v)"
            echo "Bun version: $(bun --version)"
            echo "pnpm version: $(pnpm --version)"
            pnpm i
          '';
        };
      });
}
