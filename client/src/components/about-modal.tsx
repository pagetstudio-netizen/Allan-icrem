import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import allanLogo from "@assets/allan_logo.jpg";

interface AboutModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AboutModal({ open, onClose }: AboutModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center overflow-hidden">
              <img src={allanLogo} alt="ALLAN" className="w-10 h-10 object-contain" />
            </div>
            À propos de ALLAN
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-sm text-muted-foreground">
          <p>
            ALLAN est une plateforme d'investissement dédiée aux utilisateurs du Niger 🇳🇪. Inscrivez-vous, investissez et générez des revenus quotidiens automatiques.
          </p>
          <p>
            Profitez d'un bonus d'inscription de 200F, d'un système de parrainage sur 3 niveaux et d'un support client disponible tous les jours.
          </p>
          <div className="bg-secondary rounded-lg p-4 space-y-2">
            <h4 className="font-medium text-foreground">Nos avantages :</h4>
            <ul className="space-y-1">
              <li>- Bonus d'inscription : 200F</li>
              <li>- Revenus quotidiens automatiques</li>
              <li>- Parrainage sur 3 niveaux (15% / 2% / 1%)</li>
              <li>- Support client disponible</li>
            </ul>
          </div>
          <p className="text-xs">
            Version 1.0.0 - Tous droits réservés © ALLAN
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
