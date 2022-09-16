import { Operator } from "../core/operator";

/** This patch performs an arbitrary number of mathematical operations
 *  on an initial numerical value.
 * 
 * The operations are applied in sequence starting by applying operation #1
 * with operand #1 on the initial value. The result is then applied
 * operation #2 with operand #2 and so on...
 */
export class MathOperator implements Operator {}
