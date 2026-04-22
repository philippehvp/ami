import { Component } from '@angular/core';
import { Selection } from '../selection/selection';
import { History } from '../history/history';
import { Live } from '../live/live';

@Component({
  selector: 'umpire',
  imports: [Selection, History, Live],
  templateUrl: './umpire.html',
  styleUrl: './umpire.scss',
})
export class Umpire {}
