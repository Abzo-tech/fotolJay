import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeService, THEMES } from '../../services/theme.service';
import { LucideAngularModule, Palette, X, Check } from 'lucide-angular';

@Component({
  selector: 'app-theme-selector',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './theme-selector.html',
  styleUrl: './theme-selector.css'
})
export class ThemeSelectorComponent {
  readonly Palette = Palette;
  readonly X = X;
  readonly Check = Check;
  
  showDropdown = signal<boolean>(false);
  showCustom = signal<boolean>(false);
  
  themes = THEMES;

  public open() {
    this.showDropdown.set(true);
    this.showCustom.set(false);
  }
  
  customPrimary = signal<string>('#3b82f6');
  customSecondary = signal<string>('#8b5cf6');
  customAccent = signal<string>('#f59e0b');
  customBackground = signal<string>('#ffffff');
  customSurface = signal<string>('#f9fafb');
  customText = signal<string>('#111827');

  constructor(public themeService: ThemeService) {}

  toggleDropdown() {
    this.showDropdown.update(v => !v);
    this.showCustom.set(false);
  }

  closeDropdown() {
    this.showDropdown.set(false);
    this.showCustom.set(false);
  }

  selectTheme(themeId: string) {
    this.themeService.setTheme(themeId);
    this.closeDropdown();
  }

  toggleCustom() {
    this.showCustom.update(v => !v);
  }

  applyCustomTheme() {
    this.themeService.setCustomColors({
      primary: this.customPrimary(),
      secondary: this.customSecondary(),
      accent: this.customAccent(),
      background: this.customBackground(),
      surface: this.customSurface(),
      text: this.customText()
    });
    this.closeDropdown();
  }

  isCurrentTheme(themeId: string): boolean {
    return this.themeService.currentTheme().id === themeId;
  }
}
