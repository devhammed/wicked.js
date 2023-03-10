import { IntervalService } from 'wicked.js';
import { MainContext } from '../contracts/main-context';

export function MainController($ctx: MainContext, $interval: IntervalService) {
  $ctx.count = 0;

  $ctx.interval = null;

  $ctx.handleClick = function () {
    $ctx.count += 1;
    console.log($ctx.$refs.header);
  };

  $ctx.handleToggleCounting = function () {
    if ($ctx.interval === null) {
      $ctx.interval = $interval.start(() => {
        $ctx.count += 1;
      }, 1000);
    } else {
      $interval.clear($ctx.interval!);
      $ctx.interval = null;
    }
  };
}
