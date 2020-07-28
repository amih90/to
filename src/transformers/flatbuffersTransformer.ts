import * as vscode from 'vscode';
import { flatbuffers } from "flatbuffers";
import { Transformer } from './transformer';
import { MyGame } from '../resources/monsters_generated';


export class FlatbuffersTransformer extends Transformer  {

    constructor() {
        super("flatbuffers", true);
    }


    public match(input: string): boolean {
        return true; // FIXME
    }

    public encode(input: string): string {
        // Create a `flatbuffer.Builder`, which will be used to create our
        // monsters' FlatBuffers.
        let builder = new flatbuffers.Builder(1024);

        let weaponOne = builder.createString('Sword');
        let weaponTwo = builder.createString('Axe');

        // Create the first `Weapon` ('Sword').
        MyGame.Sample.Weapon.startWeapon(builder);
        MyGame.Sample.Weapon.addName(builder, weaponOne);
        MyGame.Sample.Weapon.addDamage(builder, 3);
        let sword = MyGame.Sample.Weapon.endWeapon(builder);

        // Create the second `Weapon` ('Axe').
        MyGame.Sample.Weapon.startWeapon(builder);
        MyGame.Sample.Weapon.addName(builder, weaponTwo);
        MyGame.Sample.Weapon.addDamage(builder, 5);
        let axe = MyGame.Sample.Weapon.endWeapon(builder);

        // Serialize a name for our monster, called 'Orc'.
        let name = builder.createString('Orc');
        // Create a `vector` representing the inventory of the Orc. Each number
        // could correspond to an item that can be claimed after he is slain.
        let treasure = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        let inv = MyGame.Sample.Monster.createInventoryVector(builder, treasure);

        // Create an array from the two `Weapon`s and pass it to the
        // `createWeaponsVector()` method to create a FlatBuffer vector.
        let weaps = [sword, axe];
        let weapons = MyGame.Sample.Monster.createWeaponsVector(builder, weaps);

        MyGame.Sample.Monster.startPathVector(builder, 2);
        MyGame.Sample.Vec3.createVec3(builder, 1.0, 2.0, 3.0);
        MyGame.Sample.Vec3.createVec3(builder, 4.0, 5.0, 6.0);
        let path = builder.endVector();

        // Create our monster by using `startMonster()` and `endMonster()`.
        MyGame.Sample.Monster.startMonster(builder);
        MyGame.Sample.Monster.addPos(builder,
                            MyGame.Sample.Vec3.createVec3(builder, 1.0, 2.0, 3.0));
        MyGame.Sample.Monster.addHp(builder, 300);
        MyGame.Sample.Monster.addColor(builder, MyGame.Sample.Color.Red)
        MyGame.Sample.Monster.addName(builder, name);
        MyGame.Sample.Monster.addInventory(builder, inv);
        MyGame.Sample.Monster.addWeapons(builder, weapons);
        MyGame.Sample.Monster.addEquippedType(builder, MyGame.Sample.Equipment.Weapon);
        MyGame.Sample.Monster.addEquipped(builder, axe);
        MyGame.Sample.Monster.addPath(builder, path);
        let orc = MyGame.Sample.Monster.endMonster(builder);

        // Call `finish()` to instruct the builder that this monster is complete.
        builder.finish(orc); // You could also call `MyGame.Sample.Monster.finishMonsterBuffer(builder,
        //                                                                 orc);`.

        // This must be called after `finish()`.
        let buf = builder.asUint8Array(); // Of type `Uint8Array`

        return buf.toString();
    }

    private static getProps(obj: any) {
        let props = [];
        for (; obj !== null; obj = Object.getPrototypeOf(obj)) {
            let op = Object.getOwnPropertyNames(obj);
            for (let i=0; i<op.length; i++) {
                if (props.indexOf(op[i]) === -1) {
                    props.push(op[i]);

                }
            }
        }

        return props.filter(f => !f.startsWith("__") && ![
            "bb",
            "bb_pos",
            "constructor",
            "hasOwnProperty",
            "isPrototypeOf",
            "propertyIsEnumerable",
            "toString",
            "valueOf",
            "toLocaleString",
          ].includes(f));
    }

    public decode(input: string): string {
        // 32,0,0,0,0,0,26,0,44,0,32,0,0,0,30,0,24,0,0,0,20,0,29,0,16,0,15,0,8,0,4,0,26,0,0,0,40,0,0,0,100,0,0,0,0,0,0,1,56,0,0,0,64,0,0,0,76,0,0,0,0,0,44,1,0,0,128,63,0,0,0,64,0,0,64,64,2,0,0,0,0,0,128,64,0,0,160,64,0,0,192,64,0,0,128,63,0,0,0,64,0,0,64,64,2,0,0,0,52,0,0,0,28,0,0,0,10,0,0,0,0,1,2,3,4,5,6,7,8,9,0,0,3,0,0,0,79,114,99,0,244,255,255,255,0,0,5,0,24,0,0,0,8,0,12,0,8,0,6,0,8,0,0,0,0,0,3,0,12,0,0,0,3,0,0,0,65,120,101,0,5,0,0,0,83,119,111,114,100,0,0,0

        let data = new Uint8Array(Array.from(input.split(",")).map(Number));
        let buf = new flatbuffers.ByteBuffer(data);
        let monster: MyGame.Sample.Monster = MyGame.Sample.Monster.getRootAsMonster(buf);

        const props = FlatbuffersTransformer.getProps(monster);

        let x = {};

        for (const prop of props) {
            let y =  (<any>monster)[prop]();
            (<any>x)[prop] = y;
        }

        return JSON.stringify(x);
    }
}