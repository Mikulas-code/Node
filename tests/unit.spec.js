
import test from 'ava'
import { ukazkovaMetoda } from '../index.js'

test(
    'testovaciTest',
    (t)=>{
        const vysledek = ukazkovaMetoda();
        t.is(vysledek, 1);

    }
)