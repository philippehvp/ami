import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { TitlebarComponent } from '../titlebar/titlebar.component';

export interface IRule {
  points: number;
  condition: string;
}

@Component({
  selector: 'rule',
  templateUrl: './rule.component.html',
  styleUrls: ['./rule.component.scss'],
  imports: [MatTableModule, TitlebarComponent],
})
export class RuleComponent {
  public displayedColumns: string[] = ['points', 'conditions'];

  public rules: IRule[] = [
    {
      points: 20,
      condition: 'Vainqueur et finaliste dans le bon ordre',
    },
    {
      points: 12,
      condition: 'Uniquement le vainqueur juste',
    },
    {
      points: 10,
      condition: 'Vainqueur et finaliste inversés',
    },
    {
      points: 7,
      condition: 'Uniquement le finaliste juste',
    },
    {
      points: 5,
      condition: 'Vainqueur ou finaliste à la mauvaise place',
    },
    {
      points: 0,
      condition: 'Tous les autres cas',
    },
  ];
}
